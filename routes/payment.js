const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const User = require("../models/User");

// OPTIONAL SERVICES
let mtnService;
let airtelService;

try {
  mtnService = require("../services/mtn");
} catch (err) {
  console.log("⚠️ MTN service not available");
}

try {
  airtelService = require("../services/airtel");
} catch (err) {
  console.log("⚠️ Airtel service not available");
}

// ==========================
// CREATE PAYMENT
// ==========================
router.post("/pay", async (req, res) => {
  try {
    const { phone, name, provider, transactionId, amount } = req.body;

    // VALIDATION
    if (!phone || !name || !provider || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "phone, name, provider, transactionId are required"
      });
    }

    if (!["mtn", "airtel"].includes(provider.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Provider must be 'mtn' or 'airtel'"
      });
    }

    // CHECK DUPLICATE TRANSACTION
    const exists = await Payment.findOne({ transactionId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Transaction already exists"
      });
    }

    // CREATE PAYMENT (DEFAULT = PENDING)
    const payment = await Payment.create({
      phone,
      name,
      provider: provider.toLowerCase(),
      transactionId,
      amount: amount || 0,
      status: "pending",
      isActive: false
    });

    // ==========================
    // MTN AUTOMATION
    // ==========================
    if (provider.toLowerCase() === "mtn") {
      try {
        if (mtnService?.pay) {
          await mtnService.pay(phone, amount || 1000);
          payment.status = "processing";
          await payment.save();
          console.log("✅ MTN STK sent to", phone);
        }
      } catch (err) {
        console.log("⚠️ MTN error:", err.message);
      }
    }

    // ==========================
    // AIRTEL AUTOMATION
    // ==========================
    if (provider.toLowerCase() === "airtel") {
      try {
        if (airtelService?.requestPayment) {
          await airtelService.requestPayment(phone, amount || 1000, transactionId);
          payment.status = "processing";
          await payment.save();
          console.log("✅ Airtel payment initiated for", phone);
        }
      } catch (err) {
        console.log("⚠️ Airtel error:", err.message);
      }
    }

    // RESPONSE
    res.status(201).json({
      success: true,
      message: `${provider.toUpperCase()} payment initiated. Check your phone for prompt.`,
      status: payment.status,
      payment
    });

  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message
    });
  }
});

// ==========================
// GET ALL PAYMENTS
// ==========================
router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message
    });
  }
});

// ==========================
// GET SINGLE PAYMENT
// ==========================
router.get("/payment/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message
    });
  }
});

// ==========================
// CHECK PAYMENT STATUS
// ==========================
router.get("/status/:transactionId", async (req, res) => {
  try {
    const payment = await Payment.findOne({ transactionId: req.params.transactionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.json({
      success: true,
      transactionId: payment.transactionId,
      status: payment.status,
      isActive: payment.isActive
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check status",
      error: error.message
    });
  }
});

// ==========================
// ACTIVATE USER MANUALLY (NO AUTH REQUIRED FOR DEMO)
// ==========================
router.post("/activate/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
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
      success: true,
      message: "User activated successfully ✅",
      payment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Activation failed",
      error: error.message
    });
  }
});

// ==========================
// CHECK USER STATUS
// ==========================
router.get("/user/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
        activated: false
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check user",
      error: error.message
    });
  }
});

module.exports = router;