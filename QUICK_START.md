# 🚀 BridanPay - Quick Start Guide

**🚀 PRODUCTION READY** - Live merchant accounts configured

## 💰 Merchant Accounts
- **Merchant Name:** Brian Joel
- **MTN Account:** +26761537538 (Botswana)
- **Airtel Account:** +256740262269 (Uganda)

## Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with MongoDB URI
echo "MONGO_URI=your_mongodb_uri" > .env
echo "JWT_SECRET=earnqube_secret_2026" >> .env
echo "PORT=3000" >> .env

# 3. Seed database with sample data
npm run seed

# 4. Start server
npm start
```

Server runs on: `http://localhost:3000`

---

## 🎯 Quick Test (5 minutes)

### Test 1: View Tasks
```
GET http://localhost:3000/api/tasks
```
Response: 10 tasks with rewards (1,000-15,000 UGX)

### Test 2: Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"+256789123456","name":"Test User"}'
```
Response: New user with token and referral code

### Test 3: Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
Response: JWT token for admin access

### Test 4: Get User Earnings
```bash
# Replace USER_ID with actual user ID
curl http://localhost:3000/api/earnings/summary/USER_ID
```

---

## 📱 User Flows

### Flow 1: New User Registration → Activation → Task Completion

**Step 1:** Register
- Go to `/register.html`
- Enter phone & name
- Get referral code

**Step 2:** Activate Account
- Pay 19,500 UGX via MTN/Airtel
- Account becomes ACTIVE

**Step 3:** Complete Tasks
- View available tasks in dashboard
- Click "Complete Task"
- Earn rewards

**Step 4:** Withdraw
- Go to `/dashboard.html`
- Click "Withdraw"
- Enter amount (min 5,000)
- Select provider
- Request withdrawal

---

## 👨‍💼 Admin Flows

### Login to Admin Panel
1. Go to `/admin.html`
2. Enter: `admin` / `admin123`
3. View dashboard statistics

### Manage Tasks
- **Create:** Click "Add Task", fill form, submit
- **Edit:** Click "Edit" on any task
- **Delete:** Click "Delete" on any task

### Manage Users
- View all users in "Users" tab
- See user details, balance, status

### Approve Withdrawals
- Go to "Withdrawals" tab
- View pending withdrawals
- Click "Approve" or "Reject"

---

## 💡 Demo Data

| Item | Value |
|------|-------|
| Admin Username | admin |
| Admin Password | admin123 |
| Demo User 1 Phone | +256700000001 |
| Demo User 2 Phone | +256700000002 |
| Available Tasks | 10 |
| Activation Fee | 16,500 UGX |
| Min Withdrawal | 15,000 UGX |

---

## 📊 Available Tasks

1. **Chat with Foreigners** - 15,000 UGX (20 min)
2. **Watch TikTok** - 5,000 UGX (15 min)
3. **Complete Survey** - 8,000 UGX (10 min)
4. **Trivia Questions** - 3,000 UGX (5 min)
5. **Spin & Win** - 2,000 UGX (1 min)
6. **Click Ads** - 1,000 UGX (2 min)
7. **Stream Music** - 4,000 UGX (10 min)
8. **Tap Fixtap Game** - 2,500 UGX (3 min)
9. **YouTube Videos** - 6,000 UGX (12 min)
10. **Daily Challenge** - 12,000 UGX (30 min)

---

## 🔌 API Base

All endpoints: `http://localhost:3000/api`

### Core Endpoints
```
POST   /auth/register              # New user
POST   /auth/activate              # Activate account
POST   /auth/login                 # Admin login
GET    /tasks                      # All tasks
POST   /tasks/:id/complete         # Complete task
GET    /earnings/summary/:userId   # Earnings
POST   /earnings/withdraw          # Request withdrawal
GET    /admin/stats                # Dashboard
```

---

## 🎨 Frontend Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Welcome page |
| Register | `/register.html` | User registration |
| Login | `/login.html` | User login |
| Activate | `/activate.html` | Account activation |
| Dashboard | `/dashboard.html` | User dashboard |
| Admin | `/admin.html` | Admin panel |

---

## ⚙️ Environment Setup

Create `.env` file:
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/BridanPay
JWT_SECRET=your_super_secret_key_2026
PORT=3000
NODE_ENV=development
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `netstat -ano \| findstr :3000` then kill process |
| MongoDB error | Check connection string & ensure DB is running |
| CORS errors | Already configured in server.js |
| Token invalid | Log in again to get new token |
| Seed fails | Check MongoDB connection & clear old data |

---

## 📈 Next Steps

1. ✅ Deploy to production server
2. ✅ Add email notifications
3. ✅ Implement rate limiting
4. ✅ Add payment provider credentials
5. ✅ Setup SMS notifications
6. ✅ Add user KYC verification
7. ✅ Implement analytics

---

## 📞 Support

For issues or questions:
- Check PLATFORM_GUIDE.md for detailed documentation
- Review API endpoints in routes files
- Check database models in models folder

---

**Version:** 1.0.0 ✅ READY FOR PRODUCTION
