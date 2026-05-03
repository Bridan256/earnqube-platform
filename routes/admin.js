const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Payment = require("../models/Payment");
const User = require("../models/User");

// =======================
// GET DASHBOARD STATS
// =======================
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const successfulPayments = await Payment.countDocuments({ status: "success" });
    const activeUsers = await User.countDocuments({ activated: true });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      totalPayments,
      successfulPayments,
      activeUsers,
      totalRevenue: totalRevenue[0]?.total || 0
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// GET ALL PAYMENTS (ADMIN)
// =======================
router.get("/payments", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// GET ALL USERS (ADMIN)
// =======================
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// GET SINGLE PAYMENT
// =======================
router.get("/payment/:id", authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// MANUALLY ACTIVATE PAYMENT
// =======================
router.post("/activate/:id", authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "success";
    payment.isActive = true;
    await payment.save();

    // Create/Update User
    let user = await User.findOne({ phone: payment.phone });
    if (!user) {
      user = new User({
        phone: payment.phone,
        name: payment.name,
        status: "ACTIVE",
        activated: true
      });
    } else {
      user.status = "ACTIVE";
      user.activated = true;
    }
    await user.save();

    res.json({
      message: "Payment activated successfully ✅",
      payment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// REJECT PAYMENT
// =======================
router.post("/reject/:id", authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "failed";
    await payment.save();

    res.json({
      message: "Payment rejected",
      payment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// DELETE PAYMENT
// =======================
router.delete("/payment/:id", authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      message: "Payment deleted successfully",
      payment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;