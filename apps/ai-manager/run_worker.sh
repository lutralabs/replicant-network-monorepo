#!/bin/bash

# Set environment variables to optimize memory usage
export PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1

# Run the Celery worker with optimized settings
cd "$(dirname "$0")"
python -m celery -A src.core.celery_app worker \
    --loglevel=info \
    --concurrency=1 \
    --without-gossip \
    --without-mingle \
    --without-heartbeat \
    --max-tasks-per-child=1
