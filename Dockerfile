FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Install system dependencies, including ffmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project directory into the container
COPY . .

# By default, run a shell so we can execute commands
CMD ["/bin/bash"] 