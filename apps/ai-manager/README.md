# AI Inference API

A secure API service for AI model inference that adapts to available hardware acceleration (CUDA or MPS).

## Features

* REST API with FastAPI
* Hardware acceleration detection (CUDA, MPS/Metal, CPU fallback)
* API key authentication
* JWT token support
* Request validation
* Health check endpoint

## Project Structure

```
apps/ai-manager/
├── app.py              # Entry point for the application
├── test.py             # Entry point for running tests
├── pyproject.toml      # Project dependencies
├── Dockerfile          # Container definition
├── README.md           # This file
├── pytest.ini          # Pytest configuration
├── src/                # Source code directory
│   ├── __init__.py     # Package initialization
│   ├── main.py         # Main application code
│   └── test_api.py     # API testing utilities
└── tests/              # Test directory
    ├── __init__.py     # Package initialization
    ├── conftest.py     # Test fixtures and configuration
    ├── unit/           # Unit tests
    │   ├── __init__.py
    │   ├── test_auth.py
    │   └── test_device.py
    └── integration/    # Integration tests
        ├── __init__.py
        └── test_api_endpoints.py
```

## Requirements

* Python 3.13+
* PyTorch 2.6.0+
* FastAPI 0.110.0+
* Additional dependencies in pyproject.toml

## Setup

1. Clone the repository
2. Install dependencies:
   

```
   pip install -e .
   ```

3. For development, install test dependencies:
   

```
   pip install -e ".[test]"
   ```

4. Set environment variables (optional):
   

```
   export SECRET_KEY="your-secure-secret-key"
   export API_KEYS="key1,key2,key3"
   ```

## Running the API

### Development

```bash
python app.py
```

### Production

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

## Testing

Run the tests with:

```bash
python test.py
```

Or directly with pytest:

```bash
pytest
```

### Test Coverage

To see test coverage:

```bash
pytest --cov=src --cov-report=term-missing
```

### Running Specific Tests

Run only unit tests:

```bash
pytest tests/unit
```

Run only integration tests:

```bash
pytest tests/integration
```

Run a specific test file:

```bash
pytest tests/unit/test_auth.py
```

## API Endpoints

### GET /

Returns basic information about the API and the device being used.

### POST /infer

Performs inference using the AI model.

**Authentication**: Bearer token (API key or JWT)

**Request Body**:

```json
{
  "id": "unique-request-id",
  "prompt": "Your prompt text here (max 200 chars)"
}
```

**Response**:

```json
{
  "id": "unique-request-id",
  "result": [...],
  "processing_time": 0.123
}
```

### GET /health

Health check endpoint that returns the current status of the API.

## Authentication

The API supports two authentication methods:

1. **API Keys**: Simple API keys passed in the Authorization header
   

```
   Authorization: Bearer your-api-key
   ```

2. **JWT Tokens**: For more advanced authentication scenarios
   

```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Environment Variables

* `SECRET_KEY`: Secret key for JWT token generation/validation
* `API_KEYS`: Comma-separated list of valid API keys
* `PORT`: Port to run the server on (default: 8000)

## Deployment

This service is designed to be deployed on servers with CUDA support, but will automatically adapt to run on macOS with M1/M2 chips using Metal Performance Shaders (MPS) or fall back to CPU if neither is available.

## Security Considerations

* In production, always use a strong, unique `SECRET_KEY`
* Rotate API keys regularly
* Consider using a reverse proxy (like Nginx) with HTTPS
* Implement rate limiting for production use
