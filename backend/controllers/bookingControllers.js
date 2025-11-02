import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import * as bookingService from "../services/bookingService.js";
import { generateQrCodeUrl } from "../services/qrService.js";
import * as paymentService from "../services/paymentService.js";

// --- 1. Create Razorpay Order (before payment) ---
// @route POST /api/v1/bookings/create-order
// @access Protected
export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency,eventId,attendes,ticketCount } = req.body;
  const userId = req.user._id;
  if (!amount || !eventId || !Array.isArray(attendes) || attendes.length === 0) {
    res.status(400);
    throw new Error("Invalid booking data");
  } 

  // Create a Razorpay order
  const order = await paymentService.createPaymentOrder(totalAmount, `receipt_${userId}_${Date.now()}`);

  // Temporarily store a pending booking (unpaid)
  const newBooking = await Booking.create({
    user: userId,
    event: eventId,
    tickets,
    totalAmount,
    paymentStatus: "pending",
    razorpayOrderId: order.id,
  });

  res.status(201).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    bookingId: newBooking._id,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

// --- 2. Verify Payment & Generate QR Code ---
// @route POST /api/v1/bookings/verify-payment
// @access Protected
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature,bookingId} = req.body;

  const isValid = paymentService.verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValid) {
    res.status(400);
    throw new Error("Invalid payment signature");
  }

  // Payment verified ✅ -> Update booking + generate QR
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.paymentStatus = "paid";
  booking.razorpayPaymentId = razorpay_payment_id;

  // Generate QR code for this booking
  const { qrCodeUrl, qrCodeKey } = await bookingService.generateQrForBooking(booking._id);

  booking.qrCodeUrl = qrCodeUrl;
  booking.qrCodeKey = qrCodeKey;
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Payment verified and ticket booked successfully.",
    bookingId: booking._id,
    qrCodeUrl,
    qrCodeKey,
  });
});
