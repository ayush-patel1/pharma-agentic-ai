#!/bin/bash

# Project Verification Script
# Checks if all required files are in place

echo "🔍 Pharma Agentic LangGraph - Project Verification"
echo "=================================================="
echo ""

error_count=0

# Check backend files
echo "Checking backend files..."
files=(
    "backend/__init__.py"
    "backend/main.py"
    "backend/graph.py"
    "backend/tools.py"
    "backend/models.py"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        ((error_count++))
    fi
done

# Check data files
echo ""
echo "Checking data files..."
if [ -f "data/mock_papers.json" ]; then
    echo "✅ data/mock_papers.json"
    paper_count=$(cat data/mock_papers.json | grep -o '"title"' | wc -l)
    echo "   → Contains $paper_count papers"
else
    echo "❌ Missing: data/mock_papers.json"
    ((error_count++))
fi

# Check frontend files
echo ""
echo "Checking frontend files..."
frontend_files=(
    "frontend/package.json"
    "frontend/vite.config.js"
    "frontend/index.html"
    "frontend/src/App.jsx"
    "frontend/src/App.css"
    "frontend/src/main.jsx"
    "frontend/src/index.css"
)

for file in "${frontend_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        ((error_count++))
    fi
done

# Check config files
echo ""
echo "Checking configuration files..."
config_files=(
    "requirements.txt"
    ".gitignore"
    ".env.example"
    "README.md"
    "ARCHITECTURE.md"
    "QUICKSTART.md"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        ((error_count++))
    fi
done

# Check scripts
echo ""
echo "Checking scripts..."
if [ -x "setup.sh" ]; then
    echo "✅ setup.sh (executable)"
else
    echo "⚠️  setup.sh (not executable - run: chmod +x setup.sh)"
fi

if [ -x "run_backend.sh" ]; then
    echo "✅ run_backend.sh (executable)"
else
    echo "⚠️  run_backend.sh (not executable - run: chmod +x run_backend.sh)"
fi

if [ -x "run_frontend.sh" ]; then
    echo "✅ run_frontend.sh (executable)"
else
    echo "⚠️  run_frontend.sh (not executable - run: chmod +x run_frontend.sh)"
fi

# Check Python
echo ""
echo "Checking Python installation..."
if command -v python3 &> /dev/null; then
    version=$(python3 --version)
    echo "✅ $version"
else
    echo "❌ Python 3 not found"
    ((error_count++))
fi

# Check Node
echo ""
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    version=$(node --version)
    echo "✅ Node.js $version"
else
    echo "❌ Node.js not found"
    ((error_count++))
fi

# Check npm
if command -v npm &> /dev/null; then
    version=$(npm --version)
    echo "✅ npm $version"
else
    echo "❌ npm not found"
    ((error_count++))
fi

# Check environment
echo ""
echo "Checking environment..."
if [ -n "$GEMINI_API_KEY" ]; then
    echo "✅ GEMINI_API_KEY is set"
else
    echo "⚠️  GEMINI_API_KEY not set (required for LLM functionality)"
fi

# Check virtual environment
if [ -d "venv" ]; then
    echo "✅ Virtual environment exists"
else
    echo "⚠️  Virtual environment not created (run: python3 -m venv venv)"
fi

# Check node_modules
if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend dependencies not installed (run: cd frontend && npm install)"
fi

# Summary
echo ""
echo "=================================================="
if [ $error_count -eq 0 ]; then
    echo "✅ All critical files present!"
    echo ""
    echo "Next steps:"
    echo "1. Set GEMINI_API_KEY: export GEMINI_API_KEY='your-key...'"
    echo "2. Run setup: ./setup.sh"
    echo "3. Start backend: ./run_backend.sh"
    echo "4. Start frontend: ./run_frontend.sh"
else
    echo "❌ Found $error_count error(s)"
    echo "Please fix the missing files before proceeding."
fi
echo "=================================================="
