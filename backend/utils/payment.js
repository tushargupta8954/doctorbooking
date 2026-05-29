import Razorpay from 'razorpay';
import crypto from 'crypto';
import ApiResponse from './apiResponse.js';

// ✅ Don't initialize immediately - create a function to get instance
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are not configured');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpayInstance;
};

export const createPaymentOrder = async (amount) => {
  try {
    const razorpay = getRazorpayInstance();
    const options = {
      amount: amount.toString(),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error('Payment order creation failed');
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      return ApiResponse.success(res, null, 'Payment verified successfully');
    } else {
      return ApiResponse.error(res, 'Invalid payment signature', 400);
    }
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getPaymentDetails = async (paymentId) => {
  try {
    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new Error('Failed to fetch payment details');
  }
};

export const processRefund = async (paymentId, amount) => {
  try {
    const razorpay = getRazorpayInstance();
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount.toString()
    });
    return refund;
  } catch (error) {
    throw new Error('Refund processing failed');
  }
};