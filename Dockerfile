# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies and Node.js
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
        default-libmysqlclient-dev \
        pkg-config \
        curl \
        gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy the entire project first
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Install frontend dependencies
WORKDIR /app/frontend

# Clean install with proper flags
RUN rm -rf node_modules package-lock.json
RUN npm install --no-audit --no-fund --verbose

# Verify vite is installed and show the bin directory
RUN ls -la node_modules/.bin/
RUN which vite || echo "vite not in PATH"
RUN npm list vite

# Go back to app root
WORKDIR /app

# Create media directory
RUN mkdir -p media

# Set execute permissions for scripts and Python files
RUN find . -name "*.sh" -exec chmod +x {} \; \
    && find . -name "*.py" -exec chmod +x {} \; \
    && ls -la scripts/

# Expose ports for both services
EXPOSE 8000 5173

# Set PATH to include node_modules/.bin
ENV PATH="/app/frontend/node_modules/.bin:$PATH"

# Default command to run both services
CMD ["/app/scripts/dev.sh"]