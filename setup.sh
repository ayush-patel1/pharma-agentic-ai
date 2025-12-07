#!/bin/bash

# Quick Start Script for Pharma Agentic LangGraph
# This script sets up and runs both backend and frontend

echo "🧬 Pharma Agentic LangGraph - Quick Start"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if Gemini API key is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  Warning: GEMINI_API_KEY environment variable is not set."
    echo "Please set it with: export GEMINI_API_KEY='your-key-here'"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Setting up backend..."
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

echo ""
echo "✅ Backend setup complete!"
echo ""

# Setup frontend
echo "📦 Setting up frontend..."
echo ""
cd frontend

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""

cd ..

# Instructions
echo "🚀 Setup complete! To run the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source ../venv/bin/activate"
echo "  uvicorn main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "API Docs: http://localhost:8000/docs"
echo ""
