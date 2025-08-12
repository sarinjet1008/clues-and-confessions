#!/bin/bash
# Production start script for Flask backend

echo "🚀 Starting Flask backend server..."

# Set production environment
export FLASK_ENV=production
export FLASK_DEBUG=0

# Start the server
python server.py
