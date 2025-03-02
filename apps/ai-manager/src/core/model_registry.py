import os
import hashlib
import time
import threading
import fcntl
import errno
from typing import Dict, List, Optional, Any
from pathlib import Path
import logging
import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler

from src.core.device import device
from src.core.models import loaded_models

# Set up logging
log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=getattr(logging, log_level))
logger = logging.getLogger(__name__)


class ModelRegistry:
    """
    Registry for AI models that scans directories for model files,
    hashes them, and tracks changes.
    """

    def __init__(self):
        """
        Initialize the model registry.
        """
        # Get model directories from environment variable or use default
        model_dirs_env = os.environ.get("MODEL_DIRS", "ai-models/")
        self.model_dirs = [dir.strip() for dir in model_dirs_env.split(",")]

        self.models: Dict[str, Dict] = {}  # Hash -> model info
        self.path_to_hash: Dict[str, str] = {}  # Path -> hash
        self.scan_interval = int(os.environ.get(
            "MODEL_SCAN_INTERVAL", "10"))  # seconds
        self.file_extensions = [".ckpt", ".pt", ".pth", ".bin", ".safetensors"]
        self._stop_event = threading.Event()
        self._watcher_thread = None
        self._processing_files = set()  # Track files being processed

        # Reference to the global loaded_models dictionary
        self.loaded_models = loaded_models

        # Default inference parameters
        self.default_inference_steps = int(
            os.environ.get("DEFAULT_INFERENCE_STEPS", "30"))
        self.default_guidance_scale = float(
            os.environ.get("DEFAULT_GUIDANCE_SCALE", "7.5"))

        logger.info(
            f"Model registry initialized with directories: {self.model_dirs}")
        logger.info(f"Scan interval: {self.scan_interval} seconds")
        logger.info(f"Supported file extensions: {self.file_extensions}")

    def is_file_ready(self, file_path: str) -> bool:
        """
        Check if a file is ready to be processed (not being written to).

        Args:
            file_path: Path to the file

        Returns:
            True if the file is ready, False otherwise
        """
        if file_path in self._processing_files:
            logger.warning(f"File {file_path} is already being processed")
            return False

        try:
            # Try to get an exclusive lock on the file
            with open(file_path, 'rb') as f:
                try:
                    # Non-blocking exclusive lock
                    fcntl.flock(f.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
                    # If we got here, the file is not locked by another process
                    fcntl.flock(f.fileno(), fcntl.LOCK_UN)

                    # Check if the file size is stable (not being written to)
                    size1 = os.path.getsize(file_path)
                    time.sleep(1)  # Wait a bit
                    size2 = os.path.getsize(file_path)

                    if size1 != size2:
                        logger.warning(
                            f"File {file_path} is still being written to (size changed), waiting")
                        return False

                    return True
                except IOError as e:
                    # File is locked by another process
                    if e.errno == errno.EAGAIN:
                        logger.error(
                            f"File {file_path} is locked by another process")
                        return False
                    raise
        except Exception as e:
            logger.warning(f"Error checking if file {file_path} is ready: {e}")
            return False

    def compute_file_hash(self, file_path: str) -> str:
        """
        Compute the SHA-256 hash of a file.

        Args:
            file_path: Path to the file

        Returns:
            SHA-256 hash of the file
        """
        sha256_hash = hashlib.sha256()

        with open(file_path, "rb") as f:
            # Read the file in chunks to avoid loading large files into memory
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)

        return sha256_hash.hexdigest()

    def scan_models(self) -> Dict[str, Dict]:
        """
        Scan the model directories for model files and update the registry.

        Returns:
            Dictionary of model hashes to model info
        """
        # Track new and removed models
        new_models = []
        removed_models = list(self.path_to_hash.keys())

        # Scan all model directories
        for model_dir in self.model_dirs:
            model_path = Path(model_dir)
            if not model_path.exists():
                logger.warning(
                    f"Model directory {model_dir} does not exist. Creating it.")
                model_path.mkdir(parents=True, exist_ok=True)
                continue

            # Find all model files
            for ext in self.file_extensions:
                files_found = list(model_path.glob(f"**/*{ext}"))

                for model_file in files_found:
                    model_file_str = str(model_file)

                    # Remove from removed_models if it exists
                    if model_file_str in removed_models:
                        removed_models.remove(model_file_str)

                    # Check if the file is ready to be processed
                    if not self.is_file_ready(model_file_str):
                        logger.info(
                            f"Skipping file {model_file_str} as it's not ready yet")
                        continue

                    # Check if the file has been modified
                    file_mtime = os.path.getmtime(model_file)
                    file_size = os.path.getsize(model_file)

                    # If the file is already in the registry and hasn't changed, skip it
                    if model_file_str in self.path_to_hash:
                        model_hash = self.path_to_hash[model_file_str]
                        if (self.models[model_hash]["mtime"] == file_mtime and
                                self.models[model_hash]["size"] == file_size):
                            continue

                    # Compute the hash of the file
                    try:
                        # Mark file as being processed
                        self._processing_files.add(model_file_str)

                        file_hash = self.compute_file_hash(model_file_str)

                        # Add to the registry
                        self.models[file_hash] = {
                            "path": model_file_str,
                            "name": model_file.name,
                            "size": file_size,
                            "mtime": file_mtime,
                            "extension": ext,
                            "hash": file_hash,
                            "last_scanned": time.time()
                        }

                        # Update path to hash mapping
                        self.path_to_hash[model_file_str] = file_hash

                        # Add to new models if it's not already in the registry
                        if model_file_str not in self.path_to_hash:
                            new_models.append(file_hash)

                        logger.info(
                            f"Added/updated model: {model_file.name} (hash: {file_hash})")
                    except Exception as e:
                        logger.error(
                            f"Error processing model file {model_file}: {e}")
                    finally:
                        # Remove file from processing list
                        self._processing_files.discard(model_file_str)

        # Remove models that no longer exist
        for model_path in removed_models:
            model_hash = self.path_to_hash[model_path]

            # Remove from cache if loaded
            if model_hash in self.loaded_models:
                logger.info(f"Removing model from cache: {model_hash}")
                del self.loaded_models[model_hash]

            del self.models[model_hash]
            del self.path_to_hash[model_path]
            logger.info(f"Removed model: {model_path} (hash: {model_hash})")

        return self.models

    def get_models(self) -> List[Dict]:
        """
        Get all models in the registry.

        Returns:
            List of model info dictionaries
        """
        return list(self.models.values())

    def get_model_by_hash(self, model_hash: str) -> Optional[Dict]:
        """
        Get model info by hash.

        Args:
            model_hash: Hash of the model

        Returns:
            Model info or None if not found
        """
        return self.models.get(model_hash)

    def load_model(self, model_hash: str) -> Any:
        """
        Load a model from the registry into memory.

        Args:
            model_hash: Hash of the model to load

        Returns:
            Loaded model or None if not found

        Raises:
            ValueError: If the model is not found or cannot be loaded
        """
        # Check if model is already loaded
        if model_hash in self.loaded_models:
            logger.info(f"Using cached model: {model_hash}")
            return self.loaded_models[model_hash]

        # Get model info
        model_info = self.get_model_by_hash(model_hash)
        if not model_info:
            raise ValueError(f"Model with hash {model_hash} not found")

        # Load the model based on file extension
        model_path = model_info["path"]
        extension = model_info["extension"]

        try:
            if extension in [".ckpt", ".safetensors"]:
                # Load Stable Diffusion model
                logger.info(f"Loading Stable Diffusion model: {model_path}")

                # Set lower precision to reduce memory usage
                dtype = torch.float16 if device.type == "cuda" else torch.float32

                # Load with memory-efficient settings
                pipe = StableDiffusionPipeline.from_single_file(
                    model_path,
                    torch_dtype=dtype,
                    use_safetensors=extension == ".safetensors",
                    low_cpu_mem_usage=True,
                    variant="fp16" if dtype == torch.float16 else None
                )

                # Use DPM-Solver++ scheduler for faster inference
                pipe.scheduler = DPMSolverMultistepScheduler.from_config(
                    pipe.scheduler.config,
                    algorithm_type="dpmsolver++",
                    use_karras_sigmas=True
                )

                # Move to device
                pipe = pipe.to(device)

                # Enable memory efficient attention
                pipe.enable_attention_slicing(1)

                # Enable xformers if available and on CUDA
                if device.type == "cuda":
                    try:
                        pipe.enable_xformers_memory_efficient_attention()
                        logger.info(
                            "Enabled xformers memory efficient attention")
                    except Exception as e:
                        logger.warning(f"Could not enable xformers: {e}")

                # Cache the model
                self.loaded_models[model_hash] = pipe
                logger.info(f"Successfully loaded model: {model_info['name']}")
                return pipe
            else:
                raise ValueError(f"Unsupported model format: {extension}")
        except Exception as e:
            logger.error(f"Error loading model {model_path}: {e}")
            raise ValueError(f"Failed to load model: {str(e)}")

    def start_watcher(self):
        """
        Start the model watcher thread.
        """
        if self._watcher_thread is None or not self._watcher_thread.is_alive():
            self._stop_event.clear()
            self._watcher_thread = threading.Thread(
                target=self._watch_models, daemon=True)
            self._watcher_thread.start()
            logger.info("Started model watcher thread")

    def stop_watcher(self):
        """
        Stop the model watcher thread.
        """
        if self._watcher_thread is not None and self._watcher_thread.is_alive():
            self._stop_event.set()
            self._watcher_thread.join(timeout=5)
            logger.info("Stopped model watcher thread")

    def _watch_models(self):
        """
        Watch for changes in the model directories.
        """
        while not self._stop_event.is_set():
            try:
                self.scan_models()
            except Exception as e:
                logger.error(f"Error scanning models: {e}")

            # Wait for the next scan
            self._stop_event.wait(self.scan_interval)


# Create a singleton instance
model_registry = ModelRegistry()
