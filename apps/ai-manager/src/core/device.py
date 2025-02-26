import torch


def setup_device():
    """
    Set up the device for PyTorch operations.

    Returns:
        torch.device: The device to use for PyTorch operations.
            - CUDA if available
            - MPS if available and CUDA is not
            - CPU otherwise
    """
    device = torch.device("cpu")  # Default fallback

    if torch.cuda.is_available():
        device = torch.device("cuda")
        print("CUDA is available! Using device:",
              torch.cuda.get_device_name(0))
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        device = torch.device("mps")
        print("MPS is available! Using Apple Silicon acceleration")
    else:
        print("No GPU acceleration available. Using CPU.")

    return device


# Initialize device at startup
device = setup_device()
