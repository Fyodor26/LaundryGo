const express = require("express");
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

connectDB("mongodb://127.0.0.1:27017/laundryGo")
  .then(() => {
    console.log("MOngodb connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true 
}));
app.use(cookieParser());
app.get("/api/me", authentication, (req, res) => {
  return res.json({ user: req.user });
});
app.use("/api/orders", orderRoute);
app.use("/user", userRoute);
app.use('/dashboard', dashRoute);

app.listen(5000, () => {
  console.log("Listining on port 5000");
});
