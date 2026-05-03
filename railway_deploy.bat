@echo off
echo ===========================================
echo 🚀 EarnQube Railway Deployment Script
echo ===========================================
echo.

echo 📋 Step 1: Login to Railway...
railway login
if %errorlevel% neq 0 (
    echo ❌ Railway login failed. Please try again.
    pause
    exit /b 1
)
echo ✅ Railway login successful.
echo.

echo 📋 Step 2: Clone your GitHub repository...
if exist earnqube-deploy (
    rmdir /s /q earnqube-deploy
)
git clone https://github.com/Bridan256/earnqube-platform.git earnqube-deploy
cd earnqube-deploy
echo ✅ Repository cloned.
echo.

echo 📋 Step 3: Create Railway project...
railway init earnqube-production
if %errorlevel% neq 0 (
    echo ❌ Project creation failed.
    pause
    exit /b 1
)
echo ✅ Railway project created.
echo.

echo 📋 Step 4: Set environment variables...
railway variables set MONGO_URI=mongodb://worldbridan3_db_user:wbridan123@cluster1-shard-00-00.hybkxy.mongodb.net:27017,cluster1-shard-00-01.hybkxy.mongodb.net:27017,cluster1-shard-00-02.hybkxy.mongodb.net:27017/BridanPay?ssl=true&replicaSet=atlas-75ep9a-shard-0&authSource=admin&retryWrites=true&w=majority
railway variables set JWT_SECRET=earnqube_production_secret_2026_secure_key
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set MERCHANT_NAME=Brian Joel
railway variables set MERCHANT_PHONE_UGANDA=+256740262269
echo ✅ Environment variables set.
echo.

echo 📋 Step 5: Deploy to Railway...
railway deploy
if %errorlevel% neq 0 (
    echo ❌ Deployment failed.
    pause
    exit /b 1
)
echo ✅ Deployment successful!
echo.

echo 📋 Step 6: Get deployment URL...
railway domain
echo.

echo ===========================================
echo 🎉 DEPLOYMENT COMPLETE!
echo ===========================================
echo.
echo 🌐 Your EarnQube platform is now live!
echo 📧 Next: Connect your domain earnqube.online
echo.
echo 🔑 Test URLs:
echo - Admin Login: YOUR_RAILWAY_URL/login.html
echo - User Registration: YOUR_RAILWAY_URL/register.html
echo.
echo 📞 Credentials:
echo - Admin: admin / admin123
echo - Demo User: +256700000001
echo.

pause