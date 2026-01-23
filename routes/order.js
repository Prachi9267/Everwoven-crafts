import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const { customerName, phone, address, pincode, paymentId, items, totalAmount} = req.body;

        const newOrder = new Order({
            customerName,
            phone,
            address,
            pincode,
            paymentId,
            items,
            totalAmount
        });

        await newOrder.save();

        res.json({ success: true, message: "Order saved!", orderId: newOrder._id });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error saving order" });
    }
});

export default router;
