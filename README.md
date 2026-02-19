🧺 Laundry Love – Student Laundry Pickup & Delivery Platform

Laundry Love is a full-stack web application that allows students to schedule laundry pickup, track orders, and receive doorstep delivery. The platform provides a smooth, modern UI and a scalable backend architecture designed for real-world usage.

🚀 Live Demo

🌐 Frontend (Netlify): https://laundrygo-frontend.netlify.app

⚙️ Backend (Render): https://laundrygo-bckend.onrender.com

🧱 Tech Stack
Frontend

React

TypeScript

Vite

Tailwind CSS


Lucide Icons

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

Deployment

Netlify (Frontend)

Render (Backend)

MongoDB Atlas (Database)

✨ Features

🧺 Place laundry order

📅 Schedule pickup date & time

🏨 Hostel & room-based pickup

💰 Real-time price estimation

📦 Order confirmation screen

🌐 REST API based architecture

🔌 Frontend ↔ Backend integration

☁️ Cloud database (MongoDB Atlas)

🚀 Production deployment

🧠 System Architecture
User (Browser)
      ↓
Netlify (React Frontend)
      ↓
Render (Node + Express API)
      ↓
MongoDB Atlas (Cloud Database)

🗄️ Database (MongoDB Atlas)

Orders are stored in MongoDB Atlas using Mongoose ODM.

Example Order Schema:

{
  laundryType: String,
  quantity: Number,
  pickupDate: Date,
  timeSlot: String,
  hostel: String,
  room: String,
  phone: String,
  notes: String,
  estimatedPrice: Number,
  status: { type: String, default: "pending" },
  createdAt: Date
}

🖥️ Local Development Setup
1️⃣ Clone Repository
git clone https://github.com/Fyodor26/LaundryGo.git
cd laundry-love

2️⃣ Backend Setup
cd backend
npm install
npm start


Backend runs at:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:8080

⚙️ Environment Variables

Create .env file inside backend folder:

PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/laundry-love


On Render:

Dashboard → Service → Environment → Add same variables.

🔌 MongoDB Connection (Backend)
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed");
    process.exit(1);
  }
};

export default connectDB;


Call this in server.js:

const {connectDB} = require(./connection.js);
connectDB();

🌍 Production Notes

Frontend communicates with backend using REST APIs

Backend CORS configured for Netlify domain

Environment variables stored securely on Render

Database hosted on MongoDB Atlas

🛡️ Security

No secrets exposed in frontend

Environment variables used for sensitive data

Input validation on backend

Ready for authentication & role-based access control

📈 Future Enhancements

User authentication (Student/Admin)

Admin dashboard

Order status tracking

WhatsApp/SMS notifications

Subscription plans

👨‍💻 Author

Nakul Tayade
B.Tech Computer Engineering Student
Full Stack Developer
