import torch
import logging
import os

# Set up logging
logger = logging.getLogger(__name__)

# Determine device to use
device = torch.device("cuda" if torch.cuda.is_available() else
                      "mps" if hasattr(torch.backends, "mps") and torch.backends.mps.is_available() else
                      "cpu")

# Log the device being used
logger.info(f"Using device: {device}")

# Enable PyTorch MPS fallback if on macOS
if device.type == "mps":
    os.environ['PYTORCH_ENABLE_MPS_FALLBACK'] = '1'
    logger.info("Enabled MPS fallback for PyTorch")
