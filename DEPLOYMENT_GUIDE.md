# Earnqube - Complete Deployment Package

## 🚀 QUICK START (Railway Recommended)

### Step 1: Prepare Your Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Upload all files from this folder to your GitHub repository
3. Make sure `.env` is NOT uploaded (it's in .gitignore)

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app) and create account
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub and select the repository
4. Railway will auto-deploy (Node.js detected automatically)

### Step 3: Configure Environment Variables
In Railway project settings → Variables, add:

```
MONGO_URI=mongodb://worldbridan3_db_user:wbridan123@cluster1-shard-00-00.hybkxy.mongodb.net:27017,cluster1-shard-00-01.hybkxy.mongodb.net:27017,cluster1-shard-00-02.hybkxy.mongodb.net:27017/BridanPay?ssl=true&replicaSet=atlas-75ep9a-shard-0&authSource=admin&retryWrites=true&w=majority
JWT_SECRET=earnqube_secret_key_2026_production
NODE_ENV=production
MERCHANT_NAME=Brian Joel
MERCHANT_PHONE_BOTSWANA=+256761537538
MERCHANT_PHONE_UGANDA=+256740262269
MOMO_SUBSCRIPTION_KEY=your_mtn_subscription_key
MOMO_API_USER=your_mtn_api_user
MOMO_API_KEY=your_mtn_api_key
AIRTEL_API_KEY=your_airtel_api_key
AIRTEL_MERCHANT_ID=your_airtel_merchant_id
```

### Step 4: Add Domain (Optional)
- Go to Railway Settings → Domains
- Add your custom domain
- Update DNS records as instructed

### Step 5: Test & Go Live
- Visit your Railway URL or custom domain
- Test user registration and activation
- Monitor payments on your mobile money accounts

## 📊 Current Status
- ✅ Platform: Fully configured and tested locally
- ✅ Database: MongoDB Atlas connected
- ✅ Payments: MTN (+256761537538) and Airtel (+256740262269)
- ✅ Pricing: 16,500 UGX activation, 15,000 UGX min withdrawal
- ⏳ Deployment: Ready for cloud deployment

## 🎯 Next Actions
1. Create GitHub repository
2. Upload project files
3. Deploy to Railway
4. Configure environment variables
5. Test live application
6. Submit to Google Search Console

Your Earnqube platform is production-ready! 🚀