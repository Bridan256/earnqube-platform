const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const User = require("../models/User");

// ============================
// MTN WEBHOOK - Receive payment confirmation
// ============================
router.post("/mtn", async (req, res) => {
  try {
    const { externalId, status, amount } = req.body;

    console.log("📱 MTN Webhook:", { externalId, status, amount });

    if (!externalId) {
      return res.status(400).json({ message: "Missing externalId" });
    }

    // Find payment by transaction ID
    const payment = await Payment.findOne({ transactionId: externalId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment status based on MTN response
    if (status === "SUCCESSFUL") {
      payment.status = "success";
      payment.isActive = true;
    } else if (status === "PENDING") {
      payment.status = "processing";
    } else if (status === "FAILED") {
      payment.status = "failed";
    }

    await payment.save();

    // Create or update user if payment successful
    if (payment.status === "success") {
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
      console.log("✅ User activated:", payment.phone);
    }

    res.json({ message: "Payment updated", payment });

  } catch (err) {
    console.error("❌ MTN Webhook Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// AIRTEL WEBHOOK - Receive payment confirmation
// ============================
router.post("/airtel", async (req, res) => {
  try {
    const { transaction_id, status, subscriber } = req.body;

    console.log("📱 Airtel Webhook:", { transaction_id, status, subscriber });

    if (!transaction_id) {
      return res.status(400).json({ message: "Missing transaction_id" });
    }

    // Find payment by transaction ID
    const payment = await Payment.findOne({ transactionId: transaction_id });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment status based on Airtel response
    if (status === "SUCCESS") {
      payment.status = "success";
      payment.isActive = true;
    } else if (status === "PROCESSING") {
      payment.status = "processing";
    } else if (status === "FAILED") {
      payment.status = "failed";
    }

    await payment.save();

    // Create or update user if payment successful
    if (payment.status === "success") {
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
      console.log("✅ User activated:", payment.phone);
    }

    res.json({ message: "Payment updated", payment });

  } catch (err) {
    console.error("❌ Airtel Webhook Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// WEBHOOK STATUS - Check if webhook is working
// ============================
router.get("/status", (req, res) => {
  res.json({
    status: "✅ Webhook service active",
    mtn_endpoint: "/api/webhook/mtn",
    airtel_endpoint: "/api/webhook/airtel"
  });
});

module.exports = router;