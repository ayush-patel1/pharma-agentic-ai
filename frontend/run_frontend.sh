#!/bin/bash

# Run Frontend Development Server
# This script starts the Vite development server

echo "🚀 Starting Pharma Agentic LangGraph Frontend..."

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Node modules not found. Installing dependencies..."
    cd frontend && npm install && cd ..
fi

# Navigate to frontend directory
cd frontend

# Run the dev server
echo "Frontend running at: http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""

npm run dev
