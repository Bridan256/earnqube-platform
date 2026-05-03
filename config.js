// Configuration constants
module.exports = {
  // Payment Providers
  PROVIDERS: {
    MTN: "mtn",
    AIRTEL: "airtel"
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: "pending",
    PROCESSING: "processing",
    SUCCESS: "success",
    FAILED: "failed"
  },

  // User Status
  USER_STATUS: {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
  },

  // Default Values
  DEFAULTS: {
    MIN_AMOUNT: 1000,
    MAX_AMOUNT: 10000000,
    TOKEN_EXPIRY: "1d",
    CURRENCY: "UGX"
  },

  // API Messages
  MESSAGES: {
    PAYMENT_SUCCESS: "Payment created successfully",
    PAYMENT_FAILED: "Failed to create payment",
    USER_ACTIVATED: "User activated successfully",
    INVALID_CREDENTIALS: "Invalid credentials",
    UNAUTHORIZED: "Unauthorized access",
    NOT_FOUND: "Resource not found"
  },

  // Payment Providers Configuration
  PAYMENT_CONFIG: {
    mtn: {
      name: "MTN MoMo",
      currency: "EUR",
      sandbox: false, // Changed to production
      merchantPhone: process.env.MERCHANT_PHONE_BOTSWANA || "+26761537538"
    },
    airtel: {
      name: "Airtel Money",
      currency: "UGX",
      sandbox: false, // Changed to production
      merchantPhone: process.env.MERCHANT_PHONE_UGANDA || "+256740262269"
    }
  },

  // Merchant Configuration
  MERCHANT: {
    name: process.env.MERCHANT_NAME || "Brian Joel",
    accounts: {
      botswana: process.env.MERCHANT_PHONE_BOTSWANA || "+256761537538",
      uganda: process.env.MERCHANT_PHONE_UGANDA || "+256740262269"
    }
  }
};
