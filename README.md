# 💰 Earnqube - Qashflux-like Earning Platform

**🚀 PRODUCTION READY** - Live merchant accounts configured

## 💰 Merchant Accounts
- **Merchant Name:** Brian Joel
- **MTN Botswana:** +26761537538
- **Airtel Uganda:** +256740262269

A complete **task-based earning platform** like Qashflux where users complete simple tasks and get paid directly to their mobile money accounts. Supports **MTN MoMo** and **Airtel Money** payments.
## 🚀 Deployment Guide

### Quick Deploy to Railway (Recommended)

1. **Create Railway Account**: Go to [railway.app](https://railway.app) and sign up
2. **Connect GitHub**: Link your GitHub account
3. **Deploy Project**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select this repository
   - Railway will auto-detect Node.js and deploy
4. **Set Environment Variables**:
   - Go to project settings → Variables
   - Add all variables from `.env.production.example`
5. **Add Domain** (Optional):
   - Go to Settings → Domains
   - Add your custom domain

### Alternative: Deploy to Vercel

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: `vercel --prod`
3. **Set Environment Variables**: `vercel env add`
4. **Add Domain**: `vercel domains add yourdomain.com`

### Alternative: Deploy to Render

1. **Create Render Account**: [render.com](https://render.com)
2. **New Web Service** → Connect GitHub
3. **Configure**:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Add Environment Variables**
5. **Deploy**

## 📋 Environment Variables Required

Copy `.env.production.example` to `.env.production` and fill in:

- **MONGO_URI**: Your MongoDB Atlas connection string
- **JWT_SECRET**: Secure random string for authentication
- **MOMO_***: MTN MoMo API credentials
- **AIRTEL_***: Airtel Money API credentials

## 🌐 Domain & SSL

- **Railway/Render/Vercel**: Automatic SSL certificates included
- **Custom Domain**: Point DNS to your deployment platform
- **Google Search**: Submit your domain to Google Search Console
## 🎯 Features Overview

### ✅ **User Features**
- 📱 **Mobile-first registration** with phone number
- 💳 **One-time activation fee** (16,500 UGX)
- 📊 **Real-time earnings dashboard** with balance tracking
- 🎯 **10+ task types** (chat, videos, surveys, trivia, spins, ads, music, etc.)
- 💸 **Instant withdrawals** to MTN or Airtel (minimum 15,000 UGX)
- 🎁 **Daily login bonus** with streak rewards
- 👥 **Referral program** (earn 5,000 UGX per friend)
- 📈 **Progress tracking** (completed tasks, total earnings, withdrawal history)

### ✅ **Task Types**
1. **Chat with Foreigners** - 15,000 UGX per session
2. **Watch Videos (TikTok/YouTube)** - 5,000-6,000 UGX per video
3. **Paid Surveys** - 8,000 UGX per survey
4. **Trivia Questions** - 3,000 UGX per correct answer
5. **Daily Spin & Win** - 2,000 UGX per spin
6. **Click Ads** - 1,000 UGX per ad
7. **Stream Music** - 4,000 UGX per playlist
8. **Fixtap Game** - 2,500 UGX per game
9. **Daily Challenges** - 12,000 UGX per challenge
10. **Custom Tasks** - Variable rewards

### ✅ **Admin Features**
- 📊 **Dashboard with real-time statistics**
- 🎯 **Task management** (create, update, delete tasks)
- 👥 **User management** (view, suspend, ban)
- 💸 **Withdrawal management** (approve/reject/track)
- 📈 **Earnings analytics** and user insights
- ⚡ **Quick statistics** on platform health

### ✅ **Payment System**
- ✅ **Activation fee payment** (one-time)
- ✅ **Automatic withdrawal requests**
- ✅ **MTN & Airtel integration**
- ✅ **Withdrawal tracking & history**
- ✅ **Daily automatic payouts** (optional)

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB (Atlas or local)
- Internet connection (for payment providers)

### Installation

```bash
# 1. Navigate to project
cd Earnqube

# 2. Install dependencies
npm install

# 3. Configure .env file
# Edit .env with your MongoDB URI and payment credentials

# 4. Seed database with sample data
npm run seed

# 5. Start server
npm start
```

Server runs on **http://localhost:3000**

## 📱 Platform URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Registration** | `/register.html` | Sign up & activate account |
| **User Dashboard** | `/dashboard.html` | View tasks & earnings |
| **Admin Dashboard** | `/admin.html` | Manage platform |
| **Payment** | `/index.html` | Legacy payment page |

## 📊 User Journey

```
1. Register → 2. Activate (Pay 19,500 UGX) → 3. View Tasks → 
4. Complete Tasks → 5. Earn Money → 6. Withdraw to Mobile Money
```

## 🎮 Task Completion Flow

```javascript
1. User views available tasks
2. Clicks "Complete Task"
3. Task is marked as complete
4. Earnings are added to balance
5. Can claim daily bonus (1,000 UGX + streak bonuses)
6. Can withdraw anytime (min 5,000 UGX)
```

## 💸 Earnings Example

**Daily Potential Earnings:**
- Complete 5 chats: 75,000 UGX
- Watch 10 videos: 50,000 UGX
- Complete 5 surveys: 40,000 UGX
- Daily login bonus: 1,000 UGX
- **Total: 166,000 UGX per day!**

## 🔌 API Endpoints

### Authentication & Registration
```bash
POST   /api/auth/register              # Register new user
POST   /api/auth/activate              # Activate account (pay fee)
POST   /api/auth/login                 # Admin login
GET    /api/auth/profile/:userId       # Get user profile
```

### Task Management
```bash
GET    /api/tasks                      # Get all tasks
GET    /api/tasks/by-type/:type        # Tasks by type
POST   /api/tasks/:id/complete         # Complete a task
GET    /api/tasks/stats/overview       # Task statistics
```

### Earnings & Withdrawals
```bash
GET    /api/earnings/summary/:userId   # User earnings summary
GET    /api/earnings/history/:userId   # Earnings history
POST   /api/earnings/withdraw          # Request withdrawal
GET    /api/earnings/withdrawals/:userId # Withdrawal history
POST   /api/earnings/daily-bonus/:userId # Claim daily bonus
```

### Admin Management
```bash
GET    /api/admin/stats                # Platform statistics
GET    /api/admin/tasks                # All tasks (manage)
POST   /api/admin/tasks                # Create new task
GET    /api/admin/users                # All users
GET    /api/admin/withdrawals          # Pending withdrawals
POST   /api/admin/withdrawals/:id/approve  # Approve withdrawal
```

## 📊 Database Models

### User Model
```javascript
{
  phone: String (unique),
  name: String,
  status: "INACTIVE" | "ACTIVE" | "SUSPENDED" | "BANNED",
  activated: Boolean,
  activatedAt: Date,
  
  // Earnings
  totalEarnings: Number,
  availableBalance: Number,
  withdrawnAmount: Number,
  pendingBalance: Number,
  
  // Activity
  tasksCompleted: Number,
  loginStreak: Number,
  lastLoginAt: Date,
  
  // Referral
  referralCode: String (unique),
  referredBy: ObjectId,
  referralCount: Number,
  referralEarnings: Number,
  
  // Preferences
  primaryProvider: "mtn" | "airtel",
  autoWithdraw: Boolean,
  autoWithdrawThreshold: Number
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  type: "chat" | "video" | "survey" | "trivia" | "spin" | "ads" | "music" | "fixtap",
  reward: Number,
  duration: Number (minutes),
  difficulty: "easy" | "medium" | "hard",
  icon: String (emoji),
  dailyLimit: Number,
  isActive: Boolean
}
```

### Earning Model
```javascript
{
  userId: ObjectId,
  taskId: ObjectId,
  amount: Number,
  type: "task_completion" | "referral_bonus" | "daily_login_bonus" | "challenge_bonus",
  status: "pending" | "approved" | "paid"
}
```

### Withdrawal Model
```javascript
{
  userId: ObjectId,
  amount: Number,
  phone: String,
  provider: "mtn" | "airtel",
  status: "pending" | "processing" | "success" | "failed",
  transactionId: String,
  failureReason: String
}
```

## 🔐 Security Features

- ✅ **JWT authentication** for admin & users
- ✅ **Protected routes** with middleware
- ✅ **Unique referral codes** per user
- ✅ **Transaction ID verification**
- ✅ **Input validation** on all endpoints
- ✅ **Error handling middleware**

## 📋 Default Credentials

**Admin Account:**
```
Username: admin
Password: admin123
```
⚠️ **Change these in production!**

**Test Users (After seed):**
- Phone: +256700000001 (Activated)
- Phone: +256700000002 (Activated)
- Phone: +256700000003 (Not activated)

## 🧪 Testing the Platform

### 1. Register & Activate
```bash
1. Go to /register.html
2. Enter phone: +256700000004
3. Enter name: Test User
4. Click Register
5. In Activate tab, select provider (MTN/Airtel)
6. Complete payment (19,500 UGX)
```

### 2. Complete Tasks
```bash
1. Login to /dashboard.html
2. View available tasks
3. Click "Complete Task"
4. Earnings added automatically
```

### 3. Withdraw Earnings
```bash
1. Go to Withdraw tab
2. Enter amount (minimum 5,000 UGX)
3. Select provider
4. Request withdrawal
5. Admin approves in admin panel
6. Funds sent to phone
```

## 🔧 Configuration

### Environment Variables (.env)
```env
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=development

# MTN MoMo
MOMO_SUBSCRIPTION_KEY=xxxxx
MOMO_API_USER=xxxxx
MOMO_API_KEY=xxxxx

# Airtel Money
AIRTEL_API_KEY=xxxxx
AIRIEL_MERCHANT_ID=xxxxx
```

### Customization

**Change activation fee:**
```javascript
// In models/User.js
activationFee: { type: Number, default: 16500 }
```

**Change daily bonus amount:**
```javascript
// In routes/earnings.js
const bonusAmount = 1000 + (user.loginStreak * 500);
```

**Add new task types:**
```javascript
// In models/Task.js
type: {
  type: String,
  enum: ["chat", "video", "survey", "trivia", "spin", "ads", "music", "fixtap", "your_type"],
}
```

## 📈 Scaling & Production

### Before Deploying:
- [ ] Change default admin credentials
- [ ] Update JWT_SECRET to random string
- [ ] Enable HTTPS/SSL
- [ ] Set up proper error logging
- [ ] Configure real payment provider keys
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up monitoring & alerts
- [ ] Test all withdrawal flows

### Performance Tips:
- Cache task listings
- Use database indexing
- Implement pagination
- Add request throttling
- Use CDN for static assets

## 🐛 Troubleshooting

### "User not activated"
- User must complete activation payment first
- Check user status in admin panel

### "Task daily limit reached"
- Each task has a daily completion limit
- Limits reset at midnight

### "Insufficient balance for withdrawal"
- Minimum withdrawal: 15,000 UGX
- Check available balance in dashboard

### Payment provider errors
- Verify API credentials in .env
- Check phone number format
- Ensure amounts are valid for provider

## 📚 API Testing

**Using Postman:**
1. Register user: `POST /api/auth/register`
2. Get tasks: `GET /api/tasks`
3. Complete task: `POST /api/tasks/:id/complete`
4. Check earnings: `GET /api/earnings/summary/:userId`
5. Request withdrawal: `POST /api/earnings/withdraw`

## 🚀 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Automated daily payouts
- [ ] Task ratings/reviews
- [ ] Achievement badges
- [ ] Leaderboards
- [ ] Multiple languages
- [ ] Live chat support
- [ ] Video tutorial tasks
- [ ] Cryptocurrency payouts

## 📞 Support

Issues or questions?
1. Check error messages in browser console
2. Review API responses
3. Check /api endpoint documentation
4. Verify database connectivity
5. Check .env configuration

## 📄 License

ISC - Earnqube 2026

## 👨‍💻 Built By

**Earnqube Team** - Qashflux-like Earning Platform

---

**Ready to start earning? 💰**
1. Visit `/register.html` to create account
2. Activate with one-time fee
3. Start completing tasks & earning!


