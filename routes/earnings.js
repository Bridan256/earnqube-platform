const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Earning = require("../models/Earning");
const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// ==========================
// GET USER EARNINGS SUMMARY
// ==========================
router.get("/summary/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const totalEarnings = await Earning.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const earningsByType = await Earning.aggregate([
      { $match: { userId: user._id } },
      { $group: { 
        _id: "$type", 
        amount: { $sum: "$amount" },
        count: { $sum: 1 }
      }}
    ]);

    res.json({
      success: true,
      summary: {
        totalEarnings: totalEarnings[0]?.total || 0,
        availableBalance: user.availableBalance,
        withdrawnAmount: user.withdrawnAmount,
        pendingBalance: user.pendingBalance,
        tasksCompleted: user.tasksCompleted,
        referralEarnings: user.referralEarnings
      },
      earningsByType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================
// GET USER EARNINGS HISTORY
// ==========================
router.get("/history/:userId", async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const earnings = await Earning.find({ userId: req.params.userId })
      .populate("taskId", "title reward type")
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Earning.countDocuments({ userId: req.params.userId });

    res.json({
      success: true,
      total,
      earnings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================
// REQUEST WITHDRAWAL
// ==========================
router.post("/withdraw", async (req, res) => {
  try {
    const { userId, amount, phone, provider } = req.body;

    if (!userId || !amount || !phone || !provider) {
      return res.status(400).json({
        success: false,
        message: "userId, amount, phone, and provider are required"
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if activated
    if (!user.activated) {
      return res.status(403).json({
        success: false,
        message: "User must be activated to withdraw"
      });
    }

    // Check minimum withdrawal
    if (amount < 15000) {
      return res.status(400).json({
        success: false,
        message: "Minimum withdrawal amount is 15,000 UGX"
      });
    }

    // Check sufficient balance
    if (user.availableBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ${user.availableBalance} UGX`,
        availableBalance: user.availableBalance
      });
    }

    // Create withdrawal record
    const transactionId = `WD-${Date.now()}`;
    const withdrawal = await Withdrawal.create({
      userId,
      amount,
      phone,
      provider,
      transactionId,
      status: "pending"
    });

    // Deduct from available balance
    user.availableBalance -= amount;
    user.pendingBalance += amount;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Withdrawal request created successfully",
      withdrawal,
      newBalance: user.availableBalance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================
// GET WITHDRAWAL HISTORY
// ==========================
router.get("/withdrawals/:userId", async (req, res) => {
  try {
    const { status, limit = 20, skip = 0 } = req.query;

    let query = { userId: req.params.userId };
    if (status) query.status = status;

    const withdrawals = await Withdrawal.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Withdrawal.countDocuments(query);

    res.json({
      success: true,
      total,
      withdrawals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================
// DAILY LOGIN BONUS
// ==========================
router.post("/daily-bonus/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if already claimed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastBonus = await Earning.findOne({
      userId: user._id,
      type: "daily_login_bonus"
    }).sort({ createdAt: -1 });

    if (lastBonus) {
      const lastBonusDay = new Date(lastBonus.createdAt);
      lastBonusDay.setHours(0, 0, 0, 0);
      if (lastBonusDay < yesterday) {
        user.loginStreak = 0;
      }
    }

    const alreadyClaimed = await Earning.findOne({
      userId: user._id,
      type: "daily_login_bonus",
      createdAt: { $gte: today }
    });

    if (alreadyClaimed) {
      return res.status(400).json({
        success: false,
        message: "Daily bonus already claimed today"
      });
    }

    // Calculate bonus based on login streak
    const bonusAmount = 1000 + (user.loginStreak * 500); // Base 1000 + 500 per day streak

    // Create earning
    await Earning.create({
      userId: user._id,
      amount: bonusAmount,
      type: "daily_login_bonus",
      description: `Daily login bonus (Day ${user.loginStreak + 1})`,
      status: "approved"
    });

    // Update user
    user.availableBalance += bonusAmount;
    user.totalEarnings += bonusAmount;
    user.lastLoginAt = new Date();
    user.loginStreak += 1;
    await user.save();

    res.json({
      success: true,
      message: `Earned ${bonusAmount} UGX daily bonus!`,
      bonusAmount,
      loginStreak: user.loginStreak,
      newBalance: user.availableBalance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================
// ADD REFERRAL BONUS
// ==========================
router.post("/referral-bonus", async (req, res) => {
  try {
    const { referrerId, newUserId, bonusAmount = 5000 } = req.body;

    const referrer = await User.findById(referrerId);
    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: "Referrer not found"
      });
    }

    // Create earning for referrer
    await Earning.create({
      userId: referrerId,
      amount: bonusAmount,
      type: "referral_bonus",
      description: `Referral bonus for inviting ${newUserId}`,
      status: "approved"
    });

    // Update referrer
    referrer.availableBalance += bonusAmount;
    referrer.totalEarnings += bonusAmount;
    referrer.referralEarnings += bonusAmount;
    referrer.referralCount += 1;
    await referrer.save();

    res.json({
      success: true,
      message: `Referral bonus of ${bonusAmount} UGX added!`,
      newBalance: referrer.availableBalance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
