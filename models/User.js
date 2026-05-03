const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Basic Info
  phone: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, default: null },
  password: { type: String, default: null },

  // Activation & Status
  status: { type: String, default: "INACTIVE", enum: ["INACTIVE", "ACTIVE", "SUSPENDED", "BANNED"] },
  activated: { type: Boolean, default: false },
  activatedAt: { type: Date, default: null },
  activationFee: { type: Number, default: 16500 }, // One-time fee

  // Earnings Tracking
  totalEarnings: { type: Number, default: 0 },
  availableBalance: { type: Number, default: 0 },
  withdrawnAmount: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },

  // Daily Activity
  lastLoginAt: { type: Date, default: null },
  loginStreak: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },

  // Referral System
  referralCode: { type: String, unique: true, default: null },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  referralEarnings: { type: Number, default: 0 },
  referralCount: { type: Number, default: 0 },

  // Account Details
  level: { type: Number, default: 1 },
  verified: { type: Boolean, default: false },
  kycApproved: { type: Boolean, default: false },

  // Payment Info
  paymentMethod: { type: String, default: null },
  primaryProvider: { type: String, default: "mtn", enum: ["mtn", "airtel"] },

  // Preferences
  notificationsEnabled: { type: Boolean, default: true },
  autoWithdraw: { type: Boolean, default: false },
  autoWithdrawThreshold: { type: Number, default: 50000 }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
