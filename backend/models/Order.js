import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    address: String,
    pincode: String,
    paymentId: String,

    items: [
        {
            name: String,
            price: Number,
            qty: Number,
            color: String
        }
    ],
    totalAmount: Number,
},
    {timestamps: true});

const Order = mongoose.model("Order", orderSchema);

export default Order;
