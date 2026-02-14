const express = require("express");
const Order = require("../models/orders");
const { authentication } = require("../middlewares/auth"); // make sure you have middleware
const razorpay=require('../utils/razorpay')
const router = express.Router();
const crypto=require('crypto');

console.log(Order);

// Create a new order
router.post("/", authentication, async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user's ID from middleware
    const razorpayOrder = await razorpay.orders.create({
      amount: req.body.estimatedPrice * 100, // rupees → paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    });
    console.log(razorpayOrder);
    
    const order = await Order.create({
      service: req.body.laundryType,
      quantity: req.body.quantity,
      pickupdate: new Date(req.body.pickupDate),
      timeslot: req.body.timeSlot,
      location: req.body.location,
      roomno: req.body.room,
      mobileno: req.body.phone,
      specialInstuction: req.body.notes,
      total: req.body.estimatedPrice,
      user: userId, // ✅ associate order with logged-in user
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
    });

    res.status(201).json({orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,});
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

router.post('/verify-payment', (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;

  // Prepare the data to be signed
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  console.log(body);
  
  
  // Calculate the expected signature from Razorpay
  const expectedSignature = crypto
    .createHmac('sha256', razorpay.key_secret)
    .update(body, 'utf8')
    .digest('hex');
  console.log(expectedSignature);
  console.log(razorpay_signature);
  
  
  // Verify the payment signature
  if (expectedSignature === razorpay_signature) {
    // Signature matches, verify payment details via Razorpay API
    razorpay.payments.fetch(razorpay_payment_id)
      .then((payment) => {
        console.log(payment);
        
        if (payment.status === 'captured') {
          // Payment is successful, process the order here
          res.status(200).send({ success: true });
        } else {
          // Payment failed or status is not captured
          res.status(400).send({ message: 'Payment verification failed' });
        }
      })
      .catch((error) => {
        console.error('Error verifying payment:', error);
        res.status(500).send({ message: 'Error verifying payment' });
      });
  } else {
    // Signature does not match
    res.status(400).send({ message: 'Invalid signature' });
  }
});

module.exports = router;
