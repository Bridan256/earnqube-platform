const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    provider: {
      type: String,
      enum: ["mtn", "airtel"],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "processing", "success", "failed"],
      default: "pending"
    },

    transactionId: {
      type: String,
      default: null
    },

    failureReason: {
      type: String,
      default: null
    },

    minimumBalance: {
      type: Number,
      default: 15000 // minimum amount to withdraw
    },

    fee: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
