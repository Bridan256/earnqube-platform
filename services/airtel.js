const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

// Airtel configuration
const AIRTEL_API_KEY = process.env.AIRTEL_API_KEY || "demo-key";
const AIRTEL_MERCHANT_ID = process.env.AIRTEL_MERCHANT_ID || "demo-merchant";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const AIRTEL_BASE_URL = IS_PRODUCTION
  ? "https://openapi.airtel.africa/merchant/v1"
  : "https://openapi-sandbox.airtel.africa/merchant/v1";

// ==========================
// REQUEST PAYMENT
// ==========================
async function requestPayment(phone, amount, transactionId) {
  // Check if credentials are configured
  if (!AIRTEL_API_KEY || !AIRTEL_MERCHANT_ID ||
      AIRTEL_API_KEY === "your_airtel_api_key" ||
      AIRTEL_MERCHANT_ID === "your_airtel_merchant_id") {
    console.log("⚠️ Airtel credentials not configured - payment simulation mode");
    return { status: "PENDING", transactionId: `AIRTEL_SIM_${transactionId}` };
  }

  try {
    const response = await axios.post(
      `${AIRTEL_BASE_URL}/payments`,
      {
        reference: transactionId,
        subscriber: {
          country: "UG",
          currency: "UGX",
          msisdn: phone
        },
        transaction: {
          amount: amount.toString(),
          country: "UG",
          currency: "UGX",
          id: transactionId,
          type: "DP"
        },
        merchant: {
          name: config.MERCHANT.name,
          account: config.MERCHANT.accounts.uganda
        }
      },
      {
        headers: {
          "X-API-Key": AIRTEL_API_KEY,
          "Authorization": `Bearer ${AIRTEL_MERCHANT_ID}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Airtel API Error:", error.response?.data || error.message);
    throw error;
  }
}

// ==========================
// CHECK PAYMENT STATUS
// ==========================
async function checkPaymentStatus(transactionId) {
  try {
    const response = await axios.get(
      `${AIRTEL_BASE_URL}/payments/${transactionId}`,
      {
        headers: {
          "X-API-Key": AIRTEL_API_KEY,
          "Authorization": `Bearer ${AIRTEL_MERCHANT_ID}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Airtel Status Check Error:", error.message);
    throw error;
  }
}

// ==========================
// PROCESS REFUND
// ==========================
async function refundPayment(transactionId, amount) {
  try {
    const response = await axios.post(
      `${AIRTEL_BASE_URL}/refunds`,
      {
        transaction_id: transactionId,
        amount: amount.toString()
      },
      {
        headers: {
          "X-API-Key": AIRTEL_API_KEY,
          "Authorization": `Bearer ${AIRTEL_MERCHANT_ID}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Airtel Refund Error:", error.message);
    throw error;
  }
}

module.exports = {
  requestPayment,
  checkPaymentStatus,
  refundPayment
};