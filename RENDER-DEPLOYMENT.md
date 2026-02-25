# Deploy DevHub to Render

This guide will help you deploy your DevHub application to Render (free tier available).

## Overview

You'll deploy:
1. **Backend** - Node.js/Express API (Web Service)
2. **Frontend** - Next.js application (Static Site or Web Service)
3. **Database** - MongoDB Atlas (already configured)

---

## Prerequisites

- [x] GitHub account
- [x] Render account (sign up at https://render.com)
- [x] MongoDB Atlas account (you already have this)
- [x] Your code pushed to GitHub

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Create .gitignore (if not exists)

Make sure these files are NOT committed to Git:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.production.local
.env.development.local
.env.test.local

# Next.js
.next/
out/
build/
dist/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
*.pem

# Uploads
uploads/
!uploads/.gitkeep
!uploads/post-images/.gitkeep
!uploads/profile-pics/.gitkeep
```

### 1.2 Update Backend for Production

The backend is already configured correctly, but verify `server.js` has:

```javascript
const PORT = process.env.PORT || 4000;
```

### 1.3 Update Frontend for Production

Check `frontend/next.config.js` - it should handle environment variables properly.

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not done)

```bash
cd DevHub
git init
git add .
git commit -m "Initial commit - DevHub application"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named "devhub"
3. Don't initialize with README (you already have code)

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/devhub.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your "devhub" repository

### 3.2 Configure Backend Service

**Basic Settings:**
- **Name:** `devhub-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Important:** Update `backend/package.json` to include start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3.3 Add Environment Variables

In Render dashboard, go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render default) |
| `MONGO_URI` | `mongodb+srv://oohareddy6362_db_user:sB5Y9CqbvscifAEr@link2.fxh37vr.mongodb.net/devhub?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your_secure_random_string_here_change_this` |
| `JWT_EXPIRE` | `7d` |

**Security Note:** Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend will be available at: `https://devhub-backend.onrender.com`

### 3.5 Test Backend

Visit: `https://devhub-backend.onrender.com/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "mongodb": "connected",
  "timestamp": "2026-02-24T..."
}
```

---

## Step 4: Deploy Frontend to Render

### 4.1 Create Static Site or Web Service

**Option A: Static Site (Recommended - Free)**

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Select "devhub" repository

**Configure:**
- **Name:** `devhub-frontend`
- **Branch:** `main`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `.next`

**Option B: Web Service (If Static doesn't work)**

1. Click **"New +"** → **"Web Service"**
2. Same configuration as above but:
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 4.2 Add Environment Variables

In Render dashboard, add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://devhub-backend.onrender.com/api` |
| `NODE_ENV` | `production` |

### 4.3 Update package.json

Make sure `frontend/package.json` has:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 4.4 Deploy

1. Click **"Create Static Site"** or **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your frontend will be available at: `https://devhub-frontend.onrender.com`

---

## Step 5: Configure MongoDB Atlas for Production

### 5.1 Whitelist Render IPs

Since Render uses dynamic IPs, you need to:

1. Go to MongoDB Atlas → **Security** → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **Confirm**

**Note:** For better security, you can whitelist specific Render IP ranges. See: https://render.com/docs/static-outbound-ip-addresses

### 5.2 Verify Connection

Check your backend logs in Render dashboard. You should see:
```
Connected to MongoDB
```

---

## Step 6: Update CORS Settings

### 6.1 Update Backend CORS

Edit `backend/server.js`:

```javascript
const cors = require('cors');

// Update CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://devhub-frontend.onrender.com',
        // Add your custom domain if you have one
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 6.2 Commit and Push

```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy your backend.

---

## Step 7: Test Your Deployment

### 7.1 Test Backend

Visit: `https://devhub-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "mongodb": "connected"
}
```

### 7.2 Test Frontend

1. Visit: `https://devhub-frontend.onrender.com`
2. Try registering a new user
3. Login
4. Create a post
5. Test all features

### 7.3 Test Connection Page

Visit: `https://devhub-frontend.onrender.com/test-connection`

All connections should show green ✅

---

## Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain to Render

1. Go to your service settings
2. Click **"Custom Domains"**
3. Add your domain (e.g., `devhub.yourdomain.com`)
4. Follow DNS configuration instructions

### 8.2 Update Environment Variables

Update `NEXT_PUBLIC_API_URL` if you add a custom domain for backend.

---

## Troubleshooting

### Backend Not Starting

**Check Logs:**
1. Go to Render dashboard
2. Click on your backend service
3. Check **"Logs"** tab

**Common Issues:**
- Missing environment variables
- MongoDB connection failed
- Port configuration wrong
- Build command failed

**Solutions:**
- Verify all environment variables are set
- Check MongoDB Atlas IP whitelist
- Ensure `PORT` uses `process.env.PORT`
- Check `package.json` has correct scripts

### Frontend Not Loading

**Common Issues:**
- API URL not configured
- Build failed
- Environment variables missing

**Solutions:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check build logs for errors
- Ensure all dependencies are in `package.json`
- Try deploying as Web Service instead of Static Site

### CORS Errors

**Solution:**
Update `backend/server.js` CORS configuration to include your Render frontend URL.

### MongoDB Connection Failed

**Solutions:**
1. Check MongoDB Atlas cluster is running
2. Verify IP whitelist includes 0.0.0.0/0
3. Check connection string is correct
4. Verify database user credentials

### Slow First Load (Cold Start)

**Issue:** Render free tier services sleep after 15 minutes of inactivity.

**Solutions:**
- Upgrade to paid tier ($7/month)
- Use a service like UptimeRobot to ping your app every 14 minutes
- Accept the 30-second cold start delay

---

## Cost Breakdown

### Free Tier (What You Get)
- ✅ Backend Web Service: Free (with cold starts)
- ✅ Frontend Static Site: Free
- ✅ MongoDB Atlas: Free (512MB)
- ✅ SSL Certificates: Free
- ✅ Custom Domains: Free

**Total: $0/month**

### Paid Tier (Optional)
- Backend Web Service: $7/month (no cold starts)
- Frontend Web Service: $7/month
- MongoDB Atlas M10: $9/month (2GB)

**Total: $16-23/month**

---

## Production Checklist

Before going live:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update CORS to only allow your frontend domain
- [ ] Set up MongoDB Atlas IP whitelist properly
- [ ] Enable MongoDB Atlas backup
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure proper logging
- [ ] Set up SSL (automatic on Render)
- [ ] Test all features thoroughly
- [ ] Set up environment-specific configs
- [ ] Document API endpoints
- [ ] Set up CI/CD pipeline (optional)

---

## Useful Commands

### View Logs
```bash
# In Render dashboard, go to Logs tab
```

### Redeploy
```bash
# Push to GitHub
git add .
git commit -m "Update"
git push origin main

# Or use Render dashboard "Manual Deploy" button
```

### Rollback
```bash
# In Render dashboard, go to "Deploys" tab
# Click "Rollback" on a previous successful deploy
```

---

## Alternative Deployment Options

### Vercel (Frontend Only)
- Best for Next.js
- Free tier available
- Automatic deployments
- https://vercel.com

### Railway (Full Stack)
- Deploy both frontend and backend
- Free tier available
- https://railway.app

### Heroku (Full Stack)
- Popular platform
- Free tier removed (starts at $5/month)
- https://heroku.com

### DigitalOcean App Platform
- Full stack deployment
- Starts at $5/month
- https://www.digitalocean.com/products/app-platform

---

## Support Resources

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## Quick Reference

### Your Deployed URLs
- **Frontend:** `https://devhub-frontend.onrender.com`
- **Backend:** `https://devhub-backend.onrender.com`
- **API:** `https://devhub-backend.onrender.com/api`
- **Health Check:** `https://devhub-backend.onrender.com/api/health`

### Environment Variables Summary

**Backend:**
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://devhub-backend.onrender.com/api
NODE_ENV=production
```

---

**Last Updated:** February 24, 2026
**Deployment Platform:** Render
**Estimated Setup Time:** 30-45 minutes
