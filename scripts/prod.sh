#!/bin/bash

# Production entrypoint script
echo "Starting Django production server..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Start React frontend in the background (build and serve)
echo "Building and starting React frontend..."
cd /app/frontend && npm run build 


# Copy build output to Django static files
echo "Copying React build to Django static files..."
cp -r /app/frontend/dist/* /app/backend/static/

# Wait a moment for React to start
sleep 5

cd /app

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Django with Gunicorn
echo "Starting Django with Gunicorn on port 8000..."
gunicorn --bind 0.0.0.0:8000 --workers 3 --threads 2 --timeout 120 backend.wsgi:application
