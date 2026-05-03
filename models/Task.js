const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["chat", "video", "survey", "trivia", "spin", "ads", "music", "fixtap"],
      required: true
    },

    reward: {
      type: Number,
      required: true
    },

    duration: {
      type: Number,
      default: 5 // minutes
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy"
    },

    icon: {
      type: String,
      default: "💰"
    },

    dailyLimit: {
      type: Number,
      default: 10 // max completions per day
    },

    isActive: {
      type: Boolean,
      default: true
    },

    requirements: {
      minBalance: { type: Number, default: 0 },
      minActivationDays: { type: Number, default: 0 },
      minLevel: { type: Number, default: 1 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
