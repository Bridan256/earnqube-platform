const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Task = require("../models/Task");
const User = require("../models/User");
const Earning = require("../models/Earning");
const Withdrawal = require("../models/Withdrawal");

// ==========================
// GET DASHBOARD STATS
// ==========================
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activatedUsers = await User.countDocuments({ activated: true });
    const totalEarnings = await Earning.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalWithdrawals = await Withdrawal.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activatedUsers,
        totalEarnings: totalEarnings[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
        pendingWithdrawals: await Withdrawal.countDocuments({ status: "pending" })
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================
// TASK MANAGEMENT
// ==========================

// GET ALL TASKS
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE TASK
router.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, description, type, reward, duration, difficulty, icon, dailyLimit } = req.body;

    const task = await Task.create({
      title,
      description,
      type,
      reward,
      duration: duration || 5,
      difficulty: difficulty || "easy",
      icon: icon || "💰",
      dailyLimit: dailyLimit || 10
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE TASK
router.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE TASK
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================
// USER MANAGEMENT
// ==========================

// GET ALL USERS
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET SINGLE USER
router.get("/users/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================
// WITHDRAWAL MANAGEMENT
// ==========================

// GET ALL WITHDRAWALS
router.get("/withdrawals", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const withdrawals = await Withdrawal.find(query)
      .populate("userId", "phone name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: withdrawals.length, withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// APPROVE WITHDRAWAL
router.post("/withdrawals/:id/approve", authMiddleware, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: "success" },
      { new: true }
    ).populate("userId");

    if (!withdrawal) {
      return res.status(404).json({ success: false, message: "Withdrawal not found" });
    }

    // Update user balance
    const user = await User.findById(withdrawal.userId._id);
    user.pendingBalance -= withdrawal.amount;
    user.withdrawnAmount += withdrawal.amount;
    await user.save();

    res.json({
      success: true,
      message: "Withdrawal approved",
      withdrawal
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// REJECT WITHDRAWAL
router.post("/withdrawals/:id/reject", authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;

    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { 
        status: "failed",
        failureReason: reason || "Rejected by admin"
      },
      { new: true }
    ).populate("userId");

    if (!withdrawal) {
      return res.status(404).json({ success: false, message: "Withdrawal not found" });
    }

    // Refund user balance
    const user = await User.findById(withdrawal.userId._id);
    user.availableBalance += withdrawal.amount;
    user.pendingBalance -= withdrawal.amount;
    await user.save();

    res.json({
      success: true,
      message: "Withdrawal rejected and balance refunded",
      withdrawal
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
