# Deployment Guide

## Current Deployment Architecture

**Frontend**: Netlify  
**Backend**: Render  
**API**: Google Gemini AI

This setup separates concerns and uses platforms optimized for their respective workloads.

## Why Separate Deployments?

Serverless functions (like Vercel) have limitations:
- 250MB max size limit
- 10 second cold start timeout
- Not ideal for heavy AI/ML workloads

Your backend uses LangGraph, LangChain, and Gemini API which creates a large bundle that exceeds these limits.

## Deployment Setup

### Step 1: Deploy Backend on Render

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `ayushdev2/pharma-agentic-ai`
4. Configure:
   - **Name**: `pharma-agentic-ai`
   - **Root Directory**: leave empty
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free tier

5. Add Environment Variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key

6. Click "Create Web Service"
7. Your backend URL: `https://pharma-agentic-ai-zsgc.onrender.com`

### Step 2: Deploy Frontend on Netlify

1. Go to [Netlify.com](https://app.netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select repository: `ayushdev2/pharma-agentic-ai`
5. Configure build settings (auto-detected from `netlify.toml`):
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`

6. Add Environment Variable:
   - Click "Add environment variables"
   - **Key**: `VITE_API_URL`
   - **Value**: `https://pharma-agentic-ai-zsgc.onrender.com`

7. Click "Deploy site"

### Step 3: Verify Deployment

1. Wait for both deployments to complete
2. Visit your Netlify URL
3. Test the drug repurposing analysis feature
4. Check that the backend connection works

**Note**: The `netlify.toml` file is already configured with:
- Build settings
- SPA routing redirects
- Node version

### Troubleshooting

**Backend not responding?**
- Check Render logs for errors
- Verify `GEMINI_API_KEY` is set in Render environment variables
- Ensure backend is not sleeping (free tier sleeps after 15 min inactivity)

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` is set correctly in Netlify
- Check browser console for CORS errors
- Backend CORS is configured to allow `*.netlify.app` domains

**API quota exceeded?**
- Check your Gemini API usage at https://ai.dev/usage
- Free tier has rate limits - wait or upgrade plan

## Current Deployment Status

✅ **Backend**: Deployed on Render at `https://pharma-agentic-ai-zsgc.onrender.com`  
✅ **Frontend**: Ready to deploy on Netlify  
✅ **Local Development**: Working perfectly  

## Why This Stack?

**Netlify for Frontend:**
- ✅ Optimized for static sites and SPAs
- ✅ Instant builds and deploys
- ✅ Free tier with generous limits
- ✅ Auto SSL and CDN
- ✅ GitHub integration

**Render for Backend:**
- ✅ No cold start issues
- ✅ Support for heavy dependencies (LangGraph, LangChain)
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Persistent services (not serverless)

## Alternative Options

**Railway** - Good for full-stack deployments, auto-detects services  
**Python Anywhere** - Specialized for Python apps, no cold starts  
**Fly.io** - Good for containerized deployments
