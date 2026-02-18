const express = require("express");
const port=process.env.PORT || 5000;
const bcrypt = require("bcrypt");
const app = express();
const Order = require("./models/orders");
const User = require("./models/users");
const { authentication }= require('./middlewares/auth')
const { setuserId, getuserId } = require("./service/auth");
const orderRoute = require("./routes/orders");
const userRoute = require("./routes/users");
const cors = require("cors");
const cookieParser=require('cookie-parser')
const { connectDB } = require("./connection");
const dashRoute=require('./routes/dashboard')
require('dotenv').config();  
console.log("MONGO_URL:", process.env.MONGO_URL);

connectDB(process.env.MONGO_URL)
  .then(() => {
    console.log("MOngodb connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true 
}));
app.use(cookieParser());
app.get("/api/me", authentication, (req, res) => {
  return res.json({ user: req.user });
});
app.use("/api/orders", orderRoute);
app.use("/user", userRoute);
app.use('/dashboard', dashRoute);

app.listen(port, () => {
  console.log("Listining on port 5000");
});
