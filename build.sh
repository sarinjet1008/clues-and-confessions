#!/bin/bash
# Build script for Render deployment

echo "🚀 Starting build process..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r backend/requirements.txt

# Install Node.js dependencies and build frontend
echo "📦 Installing Node.js dependencies..."
npm install

echo "🔨 Building frontend..."
npm run build

echo "✅ Build completed successfully!"
