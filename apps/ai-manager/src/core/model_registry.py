import os
import hashlib
import time
import threading
from typing import Dict, List, Optional
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelRegistry:
    """
    Registry for AI models that scans directories for model files,
    hashes them, and tracks changes.
    """

    def __init__(self, model_dirs: List[str] = None):
        """
        Initialize the model registry.

        Args:
            model_dirs: List of directories to scan for model files
        """
        # Get model directories from environment variable or use default
        env_model_dirs = os.environ.get("MODEL_DIRS", "ai-models/")
        default_model_dirs = env_model_dirs.split(",")

        self.model_dirs = model_dirs or default_model_dirs
        self.models: Dict[str, Dict] = {}  # Hash -> model info
        self.path_to_hash: Dict[str, str] = {}  # Path -> hash
        self.scan_interval = int(os.environ.get(
            "MODEL_SCAN_INTERVAL", "10"))  # seconds
        self.file_extensions = [".ckpt", ".pt", ".pth", ".bin", ".safetensors"]
        self._stop_event = threading.Event()
        self._watcher_thread = None

        logger.info(
            f"Model registry initialized with directories: {self.model_dirs}")
        logger.info(f"Scan interval: {self.scan_interval} seconds")
        logger.info(f"Supported file extensions: {self.file_extensions}")

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
                for model_file in model_path.glob(f"**/*{ext}"):
                    model_file_str = str(model_file)

                    # Remove from removed_models if it exists
                    if model_file_str in removed_models:
                        removed_models.remove(model_file_str)

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
                        file_hash = self.compute_file_hash(model_file_str)

                        # Add to the registry
                        self.models[file_hash] = {
                            "path": model_file_str,
                            "name": model_file.name,
                            "size": file_size,
                            "mtime": file_mtime,
                            "extension": ext,
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

        # Remove models that no longer exist
        for model_path in removed_models:
            model_hash = self.path_to_hash[model_path]
            del self.models[model_hash]
            del self.path_to_hash[model_path]
            logger.info(f"Removed model: {model_path} (hash: {model_hash})")

        return self.models

    def get_model_by_hash(self, model_hash: str) -> Optional[Dict]:
        """
        Get model info by hash.

        Args:
            model_hash: Hash of the model

        Returns:
            Model info or None if not found
        """
        return self.models.get(model_hash)

    def start_watcher(self):
        """
        Start the model watcher thread.
        """
        if self._watcher_thread is not None and self._watcher_thread.is_alive():
            logger.warning("Model watcher thread is already running")
            return

        self._stop_event.clear()
        self._watcher_thread = threading.Thread(
            target=self._watch_models, daemon=True)
        self._watcher_thread.start()
        logger.info("Started model watcher thread")

    def stop_watcher(self):
        """
        Stop the model watcher thread.
        """
        if self._watcher_thread is None or not self._watcher_thread.is_alive():
            logger.warning("Model watcher thread is not running")
            return

        self._stop_event.set()
        self._watcher_thread.join(timeout=5)
        logger.info("Stopped model watcher thread")

    def _watch_models(self):
        """
        Watch for changes in the model directories.
        """
        # Initial scan
        self.scan_models()

        # Watch for changes
        while not self._stop_event.is_set():
            try:
                self.scan_models()
            except Exception as e:
                logger.error(f"Error scanning models: {e}")

            # Sleep for the scan interval
            self._stop_event.wait(self.scan_interval)


# Create a singleton instance
model_registry = ModelRegistry()
