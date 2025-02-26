#!/usr/bin/env python3
"""
Test runner for the AI Manager API
"""
import sys
import pytest

if __name__ == "__main__":
    print("Running AI Manager API tests...")

    # Run pytest with the arguments passed to this script
    sys.exit(pytest.main(sys.argv[1:] or ["tests"]))
