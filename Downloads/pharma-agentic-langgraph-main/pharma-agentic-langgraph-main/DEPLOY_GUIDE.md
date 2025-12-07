# Deployment Guide

## Problem with Current Vercel Setup

Vercel serverless functions have limitations:
- 250MB max size limit
- 10 second cold start timeout
- Not ideal for heavy AI/ML workloads

Your backend uses LangGraph, LangChain, and Gemini API which creates a large bundle that exceeds these limits.

## Recommended Approach: Separate Deployments

### Option 1: Frontend on Vercel + Backend on Render (Recommended)

#### Step 1: Deploy Backend on Render

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `pharma-agentic-backend`
   - **Root Directory**: leave empty
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free tier (for testing)

5. Click "Create Web Service"
6. Copy your backend URL (e.g., `https://pharma-agentic-backend.onrender.com`)

#### Step 2: Update Frontend Environment Variable

1. In your local project, update `frontend/.env.production`:
   ```
   VITE_API_URL=https://pharma-agentic-backend.onrender.com
   ```

2. Commit and push:
   ```bash
   git add frontend/.env.production
   git commit -m "Update API URL for production"
   git push
   ```

#### Step 3: Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Click "Deploy"

#### Step 4: Update CORS in Backend

1. Once frontend is deployed, add your Vercel URL to CORS in `backend/main.py`:
   ```python
   allow_origins=[
       "http://localhost:3000",
       "https://your-frontend.vercel.app",  # Add your Vercel URL
       "https://pharma-agentic-backend.onrender.com"
   ]
   ```

2. Commit and push - Render will auto-redeploy

### Option 2: Everything on Railway

Railway has better support for Python apps with heavy dependencies.

1. Go to [Railway.app](https://railway.app)
2. "New Project" → Connect GitHub repo
3. Railway will auto-detect both services
4. Configure frontend to use backend URL
5. Deploy

### Option 3: Backend on Python Anywhere + Frontend on Vercel

Python Anywhere is designed for Python applications and has no cold start issues.

## Current Status

- ❌ Vercel (frontend + backend combined) - **Not working** due to serverless limitations
- ✅ Local development - **Working perfectly**
- ⏳ Awaiting decision on deployment platform

## Quick Fix (If You Must Use Vercel)

If you absolutely must use Vercel, you'll need to:
1. Drastically reduce dependencies
2. Remove LangGraph and use direct API calls
3. Simplify the agent workflow

But this defeats the purpose of your sophisticated multi-agent system.

## Recommendation

**Use Render (free tier) for backend + Vercel for frontend.** This gives you:
- ✅ No cold start issues
- ✅ Support for heavy dependencies  
- ✅ Free tier available
- ✅ Automatic GitHub deployments
- ✅ Professional setup
