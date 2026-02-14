const mongoose = require("mongoose");
const { type } = require("os");
const User = require("./users");

const orderSchema = new mongoose.Schema({
  razorpayOrderId:{ 
    type: String
  },
razorpayPaymentId: {
  type: String
},
razorpaySignature: {
  type: String
},
paymentStatus: {
  type: String,
  enum: ["pending", "paid", "failed"],
  default: "pending",
},
  service: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  pickupdate: {
    type: Date,
    required: true,
  },
  timeslot: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  roomno: {
    type: Number,
    required: true,
  },
  mobileno: {
    type: Number,
    required: true,
  },
  specialInstuction: {
    type: String,
  },
  total: {
    type: Number,
    required: true,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required:true
  }
});

const Order = mongoose.model("Orders", orderSchema);

module.exports = Order;
