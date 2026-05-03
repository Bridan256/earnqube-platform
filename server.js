require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FILES (FRONTEND ENABLED)
app.use(express.static("public"));

// =======================
// DATABASE CONNECTION
// =======================
function startServer() {
  const PORT = process.env.PORT || 3000;
  const ENV = process.env.NODE_ENV || "development";

  app.listen(PORT, () => {
    console.log(`🚀 Earnqube Server running on http://localhost:${PORT} (${ENV.toUpperCase()} MODE)`);
    console.log(`💰 Merchant: ${process.env.MERCHANT_NAME || "Brian Joel"}`);
    console.log(`📱 MTN Account: ${process.env.MERCHANT_PHONE_BOTSWANA || "+26761537538"}`);
    console.log(`📱 Airtel Account: ${process.env.MERCHANT_PHONE_UGANDA || "+256740262269"}`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin.html`);
    console.log(`👤 User Dashboard: http://localhost:${PORT}/dashboard.html`);
    console.log(`🎯 Task Platform: http://localhost:${PORT}/tasks.html`);
  });
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    startServer();
  })
  .catch(err => {
    console.log("❌ Mongo Error:", err.message);
    console.log("⚠️ Please ensure your MongoDB URI is correct and your IP is whitelisted in Atlas.");
    process.exit(1);
  });

// =======================
// ROUTES
// =======================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin-tasks"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/earnings", require("./routes/earnings"));
app.use("/api/webhook", require("./routes/webhook"));

// =======================
// HOME ROUTE
// =======================
app.get("/", (req, res) => {
  res.json({
    status: "✅ Earnqube (Qashflux-like) Running",
    version: "2.0.0",
    platform: "Earning & Payment Gateway",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        activate: "POST /api/auth/activate",
        profile: "GET /api/auth/profile/:userId"
      },
      tasks: {
        all: "GET /api/tasks",
        byType: "GET /api/tasks/by-type/:type",
        complete: "POST /api/tasks/:id/complete",
        stats: "GET /api/tasks/stats/overview"
      },
      earnings: {
        summary: "GET /api/earnings/summary/:userId",
        history: "GET /api/earnings/history/:userId",
        withdraw: "POST /api/earnings/withdraw",
        dailyBonus: "POST /api/earnings/daily-bonus/:userId"
      },
      admin: {
        stats: "GET /api/admin/stats",
        users: "GET /api/admin/users"
      }
    }
  });
});

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path
  });
});

// =======================
// ERROR HANDLER
// =======================
app.use(require("./middleware/errorHandler"));

