const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Earning = require("../models/Earning");
const User = require("../models/User");

// ==========================
// GET ALL AVAILABLE TASKS
// ==========================
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true }).sort({ reward: -1 });
    
    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================
// GET TASKS BY TYPE
// ==========================
router.get("/by-type/:type", async (req, res) => {
  try {
    const tasks = await Task.find({ 
      isActive: true, 
      type: req.params.type 
    }).sort({ reward: -1 });
    
    res.json({
      success: true,
      type: req.params.type,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================
// GET SINGLE TASK
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================
// COMPLETE TASK (REQUIRES AUTH)
// ==========================
router.post("/:id/complete", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    // Get task
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
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

    // Check if user is activated
    if (!user.activated) {
      return res.status(403).json({
        success: false,
        message: "User must be activated to complete tasks"
      });
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completionsToday = await Earning.countDocuments({
      userId,
      taskId: task._id,
      createdAt: { $gte: today }
    });

    if (completionsToday >= task.dailyLimit) {
      return res.status(400).json({
        success: false,
        message: `Daily limit of ${task.dailyLimit} reached for this task`
      });
    }

    // Create earning record
    const earning = await Earning.create({
      userId,
      taskId: task._id,
      amount: task.reward,
      type: "task_completion",
      description: `Completed task: ${task.title}`,
      status: "approved"
    });

    // Update user balance
    user.availableBalance += task.reward;
    user.totalEarnings += task.reward;
    user.tasksCompleted += 1;
    await user.save();

    res.json({
      success: true,
      message: `Earned ${task.reward} UGX for completing "${task.title}"`,
      earning,
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
// GET TASK STATISTICS
// ==========================
router.get("/stats/overview", async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ isActive: true });
    const taskTypes = await Task.distinct("type", { isActive: true });
    const averageReward = await Task.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: "$reward" } } }
    ]);

    res.json({
      success: true,
      totalTasks,
      taskTypes,
      averageReward: averageReward[0]?.avg || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
