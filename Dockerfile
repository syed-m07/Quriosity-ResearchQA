# Use a Python base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Install system dependencies that might be needed by Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# The command to run will be specified in the docker-compose.yml

