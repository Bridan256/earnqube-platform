const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // USER INFO
    phone: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    // PAYMENT PROVIDER (mtn / airtel)
    provider: {
      type: String,
      required: true,
      enum: ["mtn", "airtel"]
    },

    // UNIQUE TRANSACTION ID
    transactionId: {
      type: String,
      required: true,
      unique: true
    },

    // PAYMENT STATUS FLOW
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "success", "failed"]
    },

    // ACCOUNT ACTIVATION STATUS
    isActive: {
      type: Boolean,
      default: false
    },

    // OPTIONAL AMOUNT FIELD (useful for MTN later)
    amount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);