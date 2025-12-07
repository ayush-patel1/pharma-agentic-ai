# Pharma Agentic LangGraph - Vercel Deployment Guide

## Prerequisites
1. GitHub account
2. Vercel account (sign up at vercel.com)
3. Your Gemini API key

## Step-by-Step Deployment

### 1. Prepare Your Code for Git

```bash
cd /Users/abhaykumar/Desktop/EY/pharma-agentic-langgraph

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Pharma Agentic LangGraph"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `pharma-agentic-langgraph`
3. DO NOT initialize with README (you already have files)
4. Click "Create repository"

### 3. Push to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pharma-agentic-langgraph.git

# Push code
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository `pharma-agentic-langgraph`
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
5. Add Environment Variable:
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyDVVajOq75YzUh7QcNEXMPoWVEwqKOnOxE` (or your API key)
6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /Users/abhaykumar/Desktop/EY/pharma-agentic-langgraph
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: pharma-agentic-langgraph
# - Directory: . (current)
# 
# Set environment variable:
vercel env add GEMINI_API_KEY
# Enter: AIzaSyDVVajOq75YzUh7QcNEXMPoWVEwqKOnOxE

# Deploy to production
vercel --prod
```

### 5. Access Your Deployed App

After deployment completes, Vercel will provide a URL like:
```
https://pharma-agentic-langgraph.vercel.app
```

## Troubleshooting

### If Backend Fails:
- Check Vercel logs: Go to your project → Deployments → Click deployment → View Function Logs
- Ensure GEMINI_API_KEY is set in environment variables
- Check that all Python dependencies are in `api/requirements.txt`

### If Frontend Can't Connect:
- Verify `VITE_API_URL` is set to `/api` in production
- Check CORS settings in `backend/main.py`

### To Redeploy After Changes:
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel will auto-deploy
```

## Custom Domain (Optional)

1. Go to your Vercel project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown by Vercel

## Important Notes

- **Backend runs as serverless functions** on Vercel (cold starts may occur)
- **Frontend is static** and served via Vercel's CDN
- **API routes** are available at `/api/*`
- **First request** may be slower due to serverless cold start
- **Free tier** has limits on function execution time (10s for Hobby plan)

## Files Created for Deployment

- `vercel.json` - Vercel configuration
- `api/index.py` - Backend entry point for Vercel
- `api/requirements.txt` - Python dependencies
- `frontend/.env.production` - Production environment variables
- `DEPLOYMENT.md` - This guide
