import pytest
import torch
from unittest.mock import patch
from src.main import setup_device


def test_setup_device_cpu():
    """Test that setup_device returns a CPU device when no GPU is available"""
    # Mock torch.cuda.is_available to return False
    with patch('torch.cuda.is_available', return_value=False):
        # Mock torch.backends.mps.is_available to return False
        with patch('torch.backends.mps.is_available', return_value=False):
            # Call setup_device
            device = setup_device()

            # Check that the device is CPU
            assert device.type == "cpu"


@pytest.mark.skipif(not torch.cuda.is_available(), reason="CUDA not available")
def test_setup_device_cuda():
    """Test that setup_device returns a CUDA device when CUDA is available"""
    # This test will only run if CUDA is actually available
    device = setup_device()

    # Check that the device is CUDA
    assert device.type == "cuda"


@pytest.mark.skipif(not (hasattr(torch.backends, 'mps') and torch.backends.mps.is_available()),
                    reason="MPS not available")
def test_setup_device_mps():
    """Test that setup_device returns an MPS device when MPS is available and CUDA is not"""
    # This test will only run if MPS is actually available

    # Mock torch.cuda.is_available to return False
    with patch('torch.cuda.is_available', return_value=False):
        # Call setup_device
        device = setup_device()

        # Check that the device is MPS
        assert device.type == "mps"


@pytest.mark.skipif(not torch.cuda.is_available(), reason="CUDA not available")
@pytest.mark.skipif(not (hasattr(torch.backends, 'mps') and torch.backends.mps.is_available()),
                    reason="MPS not available")
def test_setup_device_cuda_priority():
    """Test that CUDA has priority over MPS when both are available"""
    # Mock torch.cuda.is_available to return True
    with patch('torch.cuda.is_available', return_value=True):
        # Mock torch.backends.mps.is_available to return True
        with patch('torch.backends.mps.is_available', return_value=True):
            # Call setup_device
            device = setup_device()

            # Check that the device is CUDA
            assert device.type == "cuda"
