# Production Dockerfile for ASTU RAG Service
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for ChromaDB
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

EXPOSE 5001

# Use gunicorn or uvicorn for production
CMD ["python", "app.py"]
