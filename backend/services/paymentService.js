// src/services/paymentService.js
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createPaymentOrder = async (amount, receiptId) => {
  const options = {
    amount: amount*100, // Convert to paise
    currency: "INR",
    receipt: receiptId || "receipt_" + Date.now(),
  };
  const order = await razorpay.orders.create(options);
  return order;
};

// Verify Razorpay signature (for successful payment)
export const verifyPaymentSignature = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");
  return generatedSignature === razorpay_signature;
};
