# Deployment Guide for Render

This guide will help you deploy the Yacht Murder Detective game to Render.

## Prerequisites

1. A Render account (free tier available)
2. An OpenAI API key
3. Git repository with your code

## Deployment Steps

### 1. Backend Deployment (Flask API)

1. **Create a new Web Service on Render:**
   - Go to your Render dashboard
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Choose the repository containing this project

2. **Configure the service:**
   - **Name:** `yacht-murder-detective-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && python server.py`
   - **Plan:** Free

3. **Set Environment Variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PYTHON_VERSION`: `3.9.16`

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note the URL (e.g., `https://your-app-name.onrender.com`)

### 2. Frontend Deployment

1. **Create a new Static Site on Render:**
   - Go to your Render dashboard
   - Click "New +" → "Static Site"
   - Connect your Git repository

2. **Configure the service:**
   - **Name:** `yacht-murder-detective-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Plan:** Free

3. **Set Environment Variables:**
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-app-name.onrender.com`)

4. **Deploy:**
   - Click "Create Static Site"
   - Wait for the build to complete

## Environment Variables

### Backend (.env file or Render environment variables)
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000  # Render sets this automatically
```

### Frontend (Render environment variables)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Local Development

1. **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python server.py
   ```

2. **Frontend:**
   ```bash
   npm install
   npm run dev
   ```

## Troubleshooting

### Common Issues

1. **Backend not starting:**
   - Check that `OPENAI_API_KEY` is set correctly
   - Verify the build command is correct
   - Check Render logs for errors

2. **Frontend can't connect to backend:**
   - Ensure `REACT_APP_API_URL` is set to the correct backend URL
   - Check that the backend is running and accessible
   - Verify CORS is enabled (already configured in the code)

3. **Build failures:**
   - Check that all dependencies are in `requirements.txt`
   - Verify Node.js version compatibility
   - Check Render build logs for specific errors

### Health Check

You can test your backend deployment by visiting:
```
https://your-backend-url.onrender.com/health
```

This should return a JSON response with the server status.

## File Structure After Deployment

```
project/
├── backend/           # Flask API server
├── src/              # React frontend source
├── public/           # Static assets
├── render.yaml       # Render configuration
├── build.sh          # Build script
├── env.example       # Environment variables template
└── DEPLOYMENT.md     # This file
```

## Support

If you encounter issues:
1. Check the Render logs in your dashboard
2. Verify all environment variables are set correctly
3. Test the backend health endpoint
4. Check the browser console for frontend errors
