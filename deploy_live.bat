@echo off
echo 🚀 EarnQube Production Deployment Script
echo ======================================
echo.

echo 📋 Step 1: Check if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)
echo ✅ Git is installed.
echo.

echo 📋 Step 2: Initialize Git repository...
if exist .git (
    echo ✅ Git repository already exists.
) else (
    git init
    echo ✅ Git repository initialized.
)
echo.

echo 📋 Step 3: Add all files to Git...
git add .
echo ✅ Files added to Git.
echo.

echo 📋 Step 4: Commit changes...
git commit -m "Initial commit - EarnQube platform ready for production"
echo ✅ Changes committed.
echo.

echo 🎯 DEPLOYMENT COMPLETE!
echo.
echo 📝 Next Steps:
echo 1. Create GitHub repository at https://github.com/new
echo 2. Push this code: git remote add origin YOUR_REPO_URL
echo 3. Push code: git push -u origin main
echo 4. Deploy to Railway: https://railway.app
echo 5. Add environment variables in Railway dashboard
echo.
echo 🔑 Required Environment Variables:
echo MONGO_URI=your_mongodb_atlas_uri
echo JWT_SECRET=your_secure_jwt_secret
echo NODE_ENV=production
echo MERCHANT_NAME=Brian Joel
echo MERCHANT_PHONE_UGANDA=+256740262269
echo MOMO_SUBSCRIPTION_KEY=your_mtn_key
echo MOMO_API_USER=your_mtn_user
echo MOMO_API_KEY=your_mtn_api_key
echo AIRTEL_API_KEY=your_airtel_key
echo AIRTEL_MERCHANT_ID=your_airtel_merchant_id
echo.
echo 🌐 Your app will be live at: https://your-app-name.railway.app
echo.

pause