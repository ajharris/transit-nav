# Use the official Python image as a base
FROM mcr.microsoft.com/devcontainers/python:3.11

# Install Node.js (for frontend)
RUN apt-get update && \
    apt-get install -y npm && \
    rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /workspaces/transit-nav

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Install frontend dependencies
WORKDIR /workspaces/transit-nav/frontend
RUN npm install

# Set default working directory
WORKDIR /workspaces/transit-nav
