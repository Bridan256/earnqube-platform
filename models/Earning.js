const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: function() {
        return this.type === "task_completion";
      }
    },

    amount: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      enum: ["task_completion", "referral_bonus", "daily_login_bonus", "challenge_bonus", "withdrawal_refund"],
      default: "task_completion"
    },

    description: {
      type: String
    },

    status: {
      type: String,
      enum: ["pending", "approved", "paid"],
      default: "approved"
    },

    paymentMethod: {
      type: String,
      default: null
    },

    reference: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Earning", earningSchema);
