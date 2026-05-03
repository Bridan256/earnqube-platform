@echo off
echo ========================================
echo 🚀 EARNQUBE PRODUCTION DEPLOYMENT
echo ========================================
echo.

echo 📋 STEP-BY-STEP DEPLOYMENT GUIDE
echo ========================================
echo.

echo 1️⃣ CREATE GITHUB REPOSITORY
echo -------------------------------
echo • Go to: https://github.com/new
echo • Repository name: earnqube-platform
echo • Make it PUBLIC
echo • DO NOT initialize with README
echo • Click "Create repository"
echo.

echo 2️⃣ UPLOAD PROJECT FILES
echo --------------------------
echo • Open GitHub repository
echo • Click "uploading an existing file"
echo • Upload ALL files from this folder
echo • EXCEPT: .env, node_modules/, .git/
echo • Click "Commit changes"
echo.

echo 3️⃣ DEPLOY TO RAILWAY
echo ----------------------
echo • Go to: https://railway.app
echo • Sign up/Login with GitHub
echo • Click "New Project"
echo • Select "Deploy from GitHub repo"
echo • Choose "earnqube-platform"
echo • Click "Deploy"
echo.

echo 4️⃣ CONFIGURE ENVIRONMENT
echo --------------------------
echo Add these variables in Railway Variables tab:
echo.
echo MONGO_URI=mongodb://worldbridan3_db_user:wbridan123@cluster1-shard-00-00.hybkxy.mongodb.net:27017,cluster1-shard-00-01.hybkxy.mongodb.net:27017,cluster1-shard-00-02.hybkxy.mongodb.net:27017/BridanPay?ssl=true&replicaSet=atlas-75ep9a-shard-0&authSource=admin&retryWrites=true&w=majority
echo JWT_SECRET=earnqube_production_secret_2026_secure_key
echo NODE_ENV=production
echo MERCHANT_NAME=Brian Joel
echo MERCHANT_PHONE_BOTSWANA=+256761537538
echo MERCHANT_PHONE_UGANDA=+256740262269
echo MOMO_SUBSCRIPTION_KEY=your_mtn_key_here
echo MOMO_API_USER=your_mtn_user_here
echo MOMO_API_KEY=your_mtn_api_key_here
echo AIRTEL_API_KEY=your_airtel_key_here
echo AIRTEL_MERCHANT_ID=your_airtel_merchant_here
echo.

echo 5️⃣ ADD CUSTOM DOMAIN (OPTIONAL)
echo ---------------------------------
echo • Buy domain at Namecheap/GoDaddy (~$10)
echo • In Railway: Settings → Domains
echo • Add your domain name
echo • Copy DNS records to domain registrar
echo • Wait 24-48 hours for propagation
echo.

echo 6️⃣ GOOGLE SEARCH SETUP
echo ------------------------
echo • Go to: https://search.google.com/search-console
echo • Add Property → URL prefix
echo • Enter: https://yourdomain.com
echo • Verify ownership (HTML file method)
echo • Submit sitemap: /sitemap.xml
echo.

echo 7️⃣ TEST LIVE APPLICATION
echo --------------------------
echo • Visit your Railway URL or custom domain
echo • Test user registration
echo • Test admin login: admin/admin123
echo • Test task completion
echo • Test payment simulation
echo.

echo ========================================
echo 🎯 SUCCESS CHECKLIST
echo ========================================
echo [ ] GitHub repository created
echo [ ] Files uploaded to GitHub
echo [ ] Railway deployment successful
echo [ ] Environment variables configured
echo [ ] Domain connected (optional)
echo [ ] Google Search Console setup
echo [ ] Live testing completed
echo [ ] First users registered
echo [ ] Payments received on mobile money
echo.

echo ========================================
echo 📞 SUPPORT & NEXT STEPS
echo ========================================
echo.
echo If you encounter any issues:
echo 1. Check Railway deployment logs
echo 2. Verify environment variables
echo 3. Test MongoDB Atlas connection
echo 4. Check payment API credentials
echo.
echo Your platform will be live in 30-60 minutes! 🚀
echo.

pause