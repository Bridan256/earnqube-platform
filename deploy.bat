@echo off
echo 🚀 Earnqube Deployment Helper
echo.

echo 📋 Deployment Checklist:
echo 1. Choose a platform (Railway recommended)
echo 2. Create account and connect GitHub
echo 3. Deploy the application
echo 4. Set environment variables
echo 5. Add custom domain (optional)
echo 6. Test the live application
echo.

echo 🔗 Recommended Platforms:
echo • Railway: https://railway.app (Easiest for Node.js + MongoDB)
echo • Render: https://render.com (Good alternative)
echo • Vercel: https://vercel.com (Great for frontend)
echo.

echo 📝 Required Environment Variables:
echo MONGO_URI=your_mongodb_atlas_uri
echo JWT_SECRET=your_secure_secret
echo MERCHANT_NAME=Brian Joel
echo MERCHANT_PHONE_BOTSWANA=+256761537538
echo MERCHANT_PHONE_UGANDA=+256740262269
echo MOMO_SUBSCRIPTION_KEY=your_mtn_key
echo MOMO_API_USER=your_mtn_user
echo MOMO_API_KEY=your_mtn_api_key
echo AIRTEL_API_KEY=your_airtel_key
echo AIRTEL_MERCHANT_ID=your_airtel_merchant_id
echo.

echo 💡 Pro Tips:
echo • Use Railway for easiest deployment
echo • MongoDB Atlas works great with Railway
echo • Free tiers available for testing
echo • SSL certificates included automatically
echo.

pause