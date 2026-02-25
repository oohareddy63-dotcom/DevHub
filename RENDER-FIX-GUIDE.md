# Fix Login/Signup Error on Render

## 🚨 Current Error:
"Please check the API documentation. All routes should start with /api"

## 🔍 Root Cause:
The frontend is calling the backend without the `/api` prefix because the environment variable `NEXT_PUBLIC_API_URL` is not set correctly in Render.

## ✅ Solution:

### Option 1: Set Environment Variable in Render (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Select Frontend Service**: `devhub-12` (or your frontend service name)
3. **Click "Environment"** tab in the left sidebar
4. **Add or Update** the environment variable:
   
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://devhub-7.onrender.com/api` |

5. **IMPORTANT**: Make sure the value ends with `/api` (no trailing slash after api)
6. **Click "Save Changes"**
7. **Wait 2-3 minutes** for automatic redeployment
8. **Test**: Try to register/login again

### Option 2: Use .env.production File (Automatic)

I've created a `.env.production` file that will be used automatically during build. This file contains:

```
NEXT_PUBLIC_API_URL=https://devhub-7.onrender.com/api
```

After pushing this file to GitHub, Render will use it automatically during the next deployment.

## 🧪 How to Verify the Fix:

### Step 1: Check Browser Console
1. Open your deployed frontend: https://devhub-12.onrender.com
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for the log message: `API Base URL: https://devhub-7.onrender.com/api`

**What you should see:**
```
API Base URL: https://devhub-7.onrender.com/api
Environment: production
```

**If you see:**
```
API Base URL: http://localhost:4000/api
```
Then the environment variable is NOT set in Render.

### Step 2: Try to Register
1. Fill in the registration form
2. Click "Agree & Join"
3. Check the Console tab for: `API Call: https://devhub-7.onrender.com/api/auth/register`

**Success indicators:**
- ✅ URL includes `/api/auth/register`
- ✅ No error message about routes
- ✅ Registration succeeds or shows proper error (like "User already exists")

**Failure indicators:**
- ❌ Error: "Please check the API documentation"
- ❌ URL is missing `/api`
- ❌ Console shows wrong API URL

### Step 3: Check Backend Logs
1. Go to Render Dashboard
2. Select Backend Service (devhub-7)
3. Click "Logs" tab
4. Try to register from frontend
5. Look for log entry

**Success:**
```
POST /api/auth/register HTTP/1.1" 201
```

**Failure:**
```
404 - Route not found: POST /auth/register
```

## 🎯 Common Issues:

### Issue 1: Environment Variable Not Taking Effect
**Symptom:** Console still shows `localhost:4000`

**Solution:**
1. Verify the variable is saved in Render
2. Trigger manual redeploy: Click "Manual Deploy" button
3. Wait for deployment to complete
4. Hard refresh browser (Ctrl+Shift+R)

### Issue 2: Cached Old Build
**Symptom:** Changes not reflecting

**Solution:**
1. Clear browser cache
2. Open in incognito/private window
3. Check Render deployment logs show latest commit

### Issue 3: Wrong URL Format
**Symptom:** Still getting 404 errors

**Check these common mistakes:**
- ❌ `https://devhub-7.onrender.com` (missing `/api`)
- ❌ `https://devhub-7.onrender.com/api/` (extra trailing slash)
- ❌ `http://devhub-7.onrender.com/api` (http instead of https)
- ✅ `https://devhub-7.onrender.com/api` (CORRECT)

## 📝 Environment Variables Checklist:

### Backend (devhub-7):
```
✅ NODE_ENV=production
✅ PORT=10000
✅ MONGO_URI=mongodb+srv://...
✅ JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
✅ JWT_EXPIRE=7d
✅ FRONTEND_URL=https://devhub-12.onrender.com
```

### Frontend (devhub-12):
```
✅ NEXT_PUBLIC_API_URL=https://devhub-7.onrender.com/api
✅ NODE_ENV=production
```

## 🚀 After the Fix:

Once the environment variable is set correctly:
1. ✅ Registration will work
2. ✅ Login will work
3. ✅ All API calls will succeed
4. ✅ No more "routes should start with /api" error

## 🆘 Still Not Working?

If you've set the environment variable and it's still not working:

1. **Check the exact URL** in Render environment tab
2. **Copy-paste** this exact value: `https://devhub-7.onrender.com/api`
3. **Save** and wait for redeploy
4. **Clear browser cache** completely
5. **Test in incognito window**

## 📞 Quick Test Commands:

Test backend directly:
```bash
curl https://devhub-7.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "mongodb": "connected"
}
```

---

**Last Updated:** February 25, 2026
**Your URLs:**
- Backend: https://devhub-7.onrender.com
- Frontend: https://devhub-12.onrender.com
