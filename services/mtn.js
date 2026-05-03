const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

const SUB_KEY = process.env.MOMO_SUBSCRIPTION_KEY;
const API_USER = process.env.MOMO_API_USER;
const API_KEY = process.env.MOMO_API_KEY;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// API URLs based on environment
const BASE_URL = IS_PRODUCTION
  ? "https://momodeveloper.mtn.com"
  : "https://sandbox.momodeveloper.mtn.com";

// ==========================
// GET TOKEN
// ==========================
async function getToken() {
  const auth = Buffer.from(`${API_USER}:${API_KEY}`).toString("base64");

  const res = await axios.post(
    `${BASE_URL}/collection/token/`,
    {},
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Ocp-Apim-Subscription-Key": SUB_KEY
      }
    }
  );

  return res.data.access_token;
}

// ==========================
// INITIATE PAYMENT
// ==========================
async function pay(phone, amount) {
  // Check if credentials are configured
  if (!SUB_KEY || !API_USER || !API_KEY || SUB_KEY === "your_mtn_subscription_key") {
    console.log("⚠️ MTN credentials not configured - payment simulation mode");
    return `MTN_SIM_${uuidv4()}`;
  }

  try {
    const token = await getToken();
    const reference = uuidv4();

    await axios.post(
      `${BASE_URL}/collection/v1_0/requesttopay`,
      {
        amount: amount.toString(),
        currency: "EUR",
        externalId: reference,
        payer: {
          partyIdType: "MSISDN",
          partyId: phone
        },
        payerMessage: `Payment to ${config.MERCHANT.name}`,
        payeeNote: "Earnqube Activation Fee"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Reference-Id": reference,
          "X-Target-Environment": IS_PRODUCTION ? "mtnbotswana" : "sandbox",
          "Ocp-Apim-Subscription-Key": SUB_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ MTN STK sent:", phone, amount);
    return reference;
  } catch (error) {
    console.error("❌ MTN Payment Error:", error.message);
    throw error;
  }
}

module.exports = { pay };