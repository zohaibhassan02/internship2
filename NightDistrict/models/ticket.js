import mongoose from "mongoose";
const TicketSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId
    },
    paymentId: {
        type: String
    },
    type: {
        type: String,
        enum: ['regular', 'vip'],
        default: 'regular'
    },
    ticketPrice: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    quantity: {
        type: Number,
        default: 1
    },
    purchaseDate: {
        type: Date,
        default: Date.now()
    }
});
export default mongoose.model('ticket', TicketSchema);