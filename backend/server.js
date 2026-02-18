import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();



const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://everwoven-crafts.pages.dev"
}));

// -------------------
// 1. Database Connection
// -------------------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// -------------------
// 2. Razorpay Instance
// -------------------
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------------------
// 3. Create Order Route (Used by Checkout Page)
// -------------------

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: "order_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (err) {
        console.error("Error creating Razorpay order:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// -------------------
// 4. Auth Routes
// -------------------
app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

// -------------------
// 5. Start Server
// -------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

