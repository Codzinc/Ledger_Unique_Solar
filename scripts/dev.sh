#!/bin/bash

# Development entrypoint script
echo "Starting Django development server..."

# Wait for database to be ready (if using external DB)
# sleep 5

# Start React frontend in the background
echo "Starting React development server on port 5173..."
cd /app/frontend && npm run dev &


# Wait a moment for React to start
sleep 3


# Run database migrations
echo "Running database migrations..."
python backend/manage.py migrate

# collect static files
python backend/manage.py collectstatic --noinput

# Create superuser if it doesn't exist (optional)
# echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

# Start Django development server
echo "Starting Django development server on port 8000..."
python backend/manage.py runserver 0.0.0.0:8000
