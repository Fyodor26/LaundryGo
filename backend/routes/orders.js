const express = require("express");
const Order = require("../models/orders");
const { authentication } = require("../middlewares/auth"); // make sure you have middleware

const router = express.Router();

// Create a new order
router.post("/", authentication, async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user's ID from middleware

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
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

module.exports = router;
