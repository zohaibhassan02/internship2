import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    orderId: {
        type: String
    },
    orderDetail: [{
        productId: {
            type: mongoose.Types.ObjectId
        },
        qty: {
            type: Number,
            default: 1
        },
        unitPrice: {
            type: Number
        },
        amount: {
            type: Number,
            default: 0
        },
    }],
    orderStatus: {
        type: Number,
        default: 1
        //1 = pending, 2 = preparing, 3 = completed
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    paymentId: {
        type: String
    },
    dateTime: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    }
});
export default mongoose.model("order", orderSchema)