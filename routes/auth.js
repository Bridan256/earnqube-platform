const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Earning = require("../models/Earning");

// =======================
// USER REGISTRATION
// =======================
router.post("/register", async (req, res) => {
  try {
    const { phone, name, referralCode } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this phone already exists"
      });
    }

    // Generate referral code
    const newReferralCode = `REF-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Find referrer if provided
    const referrer = referralCode ? await User.findOne({ referralCode }) : null;

    // Create user
    const user = await User.create({
      phone,
      name: name || "User",
      referralCode: newReferralCode,
      referredBy: referrer ? referrer._id : null
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        referralCode: user.referralCode,
        activated: user.activated,
        activationFee: user.activationFee
      },
      token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
});

// =======================
// ACTIVATE ACCOUNT
// =======================
router.post("/activate", async (req, res) => {
  try {
    const { userId, phone, provider, transactionId } = req.body;

    if (!phone || !provider || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "phone, provider, and transactionId are required"
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.activated) {
      return res.status(400).json({
        success: false,
        message: "User is already activated"
      });
    }

    // Update user activation
    user.activated = true;
    user.status = "ACTIVE";
    user.activatedAt = new Date();
    user.primaryProvider = provider;
    user.paymentMethod = phone;
    await user.save();

    // Pay referral bonus if this user was referred
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        const referralBonus = 5000;
        await Earning.create({
          userId: referrer._id,
          amount: referralBonus,
          type: "referral_bonus",
          description: `Referral bonus for activating ${user.phone}`,
          status: "approved"
        });

        referrer.availableBalance += referralBonus;
        referrer.totalEarnings += referralBonus;
        referrer.referralEarnings += referralBonus;
        referrer.referralCount += 1;
        await referrer.save();
      }
    }

    res.json({
      success: true,
      message: "Account activated successfully! 🎉",
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        activated: user.activated,
        availableBalance: user.availableBalance
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Activation failed",
      error: error.message
    });
  }
});

// =======================
// ADMIN LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check password (upgrade to bcrypt in production)
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
});

// =======================
// GET USER PROFILE
// =======================
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =======================
// UPDATE USER PROFILE
// =======================
router.put("/profile/:userId", async (req, res) => {
  try {
    const { name, email, notificationsEnabled, autoWithdraw, autoWithdrawThreshold } = req.body;

    const existingUser = await User.findById(req.params.userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        name: name || existingUser.name,
        email,
        notificationsEnabled,
        autoWithdraw,
        autoWithdrawThreshold
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;