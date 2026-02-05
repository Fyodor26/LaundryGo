const express=require('express')
const Order=require('../models/orders')
const router=express.Router();
const { authentication }= require('../middlewares/auth')

router.get("/", authentication, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("user", "name email");
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports=router