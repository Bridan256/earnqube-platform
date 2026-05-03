require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/admin");
const User = require("../models/User");
const Task = require("../models/Task");
const Earning = require("../models/Earning");

// Increase connection timeout
mongoose.set('bufferTimeoutMS', 30000);

mongoose.connect(process.env.MONGO_URI, {
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  maxPoolSize: 10,
})
  .then(() => console.log("✅ MongoDB Connected for seeding"))
  .catch(err => {
    console.log("❌ Mongo Error:", err.message);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    // Clear existing data
    await Admin.deleteMany();
    await User.deleteMany();
    await Task.deleteMany();
    await Earning.deleteMany();
    console.log("✅ Cleared existing data");

    // ==================
    // SEED ADMIN
    // ==================
    const admin = await Admin.create({
      username: "admin",
      password: "admin123"
    });
    console.log("✅ Admin created (Username: admin, Password: admin123)");

    // ==================
    // SEED TASKS
    // ==================
    const tasks = await Task.insertMany([
      {
        title: "Chat with Foreigners",
        description: "Chat with international users for a set time period",
        type: "chat",
        reward: 15000,
        duration: 20,
        difficulty: "easy",
        icon: "💬",
        dailyLimit: 5
      },
      {
        title: "Watch TikTok Videos",
        description: "Watch 10-20 TikTok videos fully and earn per video",
        type: "video",
        reward: 5000,
        duration: 15,
        difficulty: "easy",
        icon: "🎬",
        dailyLimit: 20
      },
      {
        title: "Complete Survey",
        description: "Answer market research survey questions",
        type: "survey",
        reward: 8000,
        duration: 10,
        difficulty: "medium",
        icon: "📋",
        dailyLimit: 10
      },
      {
        title: "Answer Trivia Questions",
        description: "Answer fun trivia questions for correct answers",
        type: "trivia",
        reward: 3000,
        duration: 5,
        difficulty: "easy",
        icon: "🧠",
        dailyLimit: 15
      },
      {
        title: "Spin & Win Daily Prize",
        description: "Use your daily spin to get instant cash rewards",
        type: "spin",
        reward: 2000,
        duration: 1,
        difficulty: "easy",
        icon: "🎡",
        dailyLimit: 1
      },
      {
        title: "Click Paid Ads",
        description: "Click on sponsored ads and view them fully",
        type: "ads",
        reward: 1000,
        duration: 2,
        difficulty: "easy",
        icon: "📢",
        dailyLimit: 25
      },
      {
        title: "Stream Music",
        description: "Listen to curated songs for a set time",
        type: "music",
        reward: 4000,
        duration: 10,
        difficulty: "easy",
        icon: "🎵",
        dailyLimit: 15
      },
      {
        title: "Tap Fixtap Game",
        description: "Tap on the screen as fast as possible",
        type: "fixtap",
        reward: 2500,
        duration: 3,
        difficulty: "medium",
        icon: "👆",
        dailyLimit: 10
      },
      {
        title: "YouTube Video Rewards",
        description: "Watch YouTube videos and complete them fully",
        type: "video",
        reward: 6000,
        duration: 12,
        difficulty: "easy",
        icon: "📹",
        dailyLimit: 15
      },
      {
        title: "Daily Challenge",
        description: "Complete special daily challenges for bonus rewards",
        type: "survey",
        reward: 12000,
        duration: 30,
        difficulty: "hard",
        icon: "🏆",
        dailyLimit: 1
      }
    ]);
    console.log(`✅ Created ${tasks.length} tasks`);

    // ==================
    // SEED SAMPLE USERS
    // ==================
    const referralCode1 = "REF-USER001";
    const referralCode2 = "REF-USER002";

    const users = await User.insertMany([
      {
        phone: "+256700000001",
        name: "John Doe",
        email: "john@example.com",
        activated: true,
        activatedAt: new Date(),
        status: "ACTIVE",
        referralCode: referralCode1,
        totalEarnings: 150000,
        availableBalance: 75000,
        tasksCompleted: 25,
        loginStreak: 5
      },
      {
        phone: "+256700000002",
        name: "Jane Smith",
        email: "jane@example.com",
        activated: true,
        activatedAt: new Date(),
        status: "ACTIVE",
        referralCode: referralCode2,
        referredBy: null,
        totalEarnings: 95000,
        availableBalance: 45000,
        tasksCompleted: 18,
        loginStreak: 3,
        referralCount: 2,
        referralEarnings: 10000
      },
      {
        phone: "+256700000003",
        name: "Bob Johnson",
        email: "bob@example.com",
        activated: false,
        status: "INACTIVE"
      }
    ]);
    console.log(`✅ Created ${users.length} sample users`);

    // ==================
    // SEED SAMPLE EARNINGS
    // ==================
    const earnings = await Earning.insertMany([
      {
        userId: users[0]._id,
        taskId: tasks[0]._id,
        amount: 15000,
        type: "task_completion",
        description: "Completed task: Chat with Foreigners",
        status: "approved"
      },
      {
        userId: users[0]._id,
        taskId: tasks[1]._id,
        amount: 5000,
        type: "task_completion",
        description: "Completed task: Watch TikTok Videos",
        status: "approved"
      },
      {
        userId: users[0]._id,
        amount: 1000,
        type: "daily_login_bonus",
        description: "Daily login bonus (Day 5)",
        status: "approved"
      },
      {
        userId: users[1]._id,
        taskId: tasks[2]._id,
        amount: 8000,
        type: "task_completion",
        description: "Completed task: Complete Survey",
        status: "approved"
      },
      {
        userId: users[1]._id,
        amount: 5000,
        type: "referral_bonus",
        description: "Referral bonus for inviting users",
        status: "approved"
      }
    ]);
    console.log(`✅ Created ${earnings.length} sample earnings`);

    console.log("\n📊 Seeding completed successfully!\n");
    console.log("📌 Admin Login: admin / admin123");
    console.log("📌 Test User 1: +256700000001 (Already activated)");
    console.log("📌 Test User 2: +256700000002 (Already activated)");
    console.log("📌 Test User 3: +256700000003 (Not activated)");
    console.log("\n✅ Database ready for testing!\n");

    process.exit(0);

  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
}

seedDatabase();