const express=require('express')
const Order=require('../models/orders')
const router=express.Router();
const { authentication }= require('../middlewares/auth');
const { rawListeners } = require('../models/users');

router.get("/", authentication, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("user", "name email");
    
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post('/cancel/:id', async(req, res)=>{
  const id=req.params.id
  
  try{
    const cancelled=await Order.findOneAndDelete({_id: id})
    res.status(200).json({message : "Order deleted"});
  }catch(err){
    return res.json({error: err})
  }
})
 
module.exports=router