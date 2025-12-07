#!/bin/bash

# Run Backend Server
# This script activates the virtual environment and starts the FastAPI server

echo "🚀 Starting Pharma Agentic LangGraph Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run: ./setup.sh"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  Warning: GEMINI_API_KEY not set!"
    echo "Please set it with: export GEMINI_API_KEY='your-key-here'"
    echo ""
fi

# Navigate to backend directory
cd backend

# Run the server
echo "Backend running at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"
echo "Press Ctrl+C to stop"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000
