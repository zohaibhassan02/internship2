import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    eventDateTime: {
        type: Date
    },
    createdByUserId: {
        type: mongoose.Schema.Types.ObjectId
    },
    djPerforming: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId
            }
        }
    ],
    image: {
        type: String
    },
    ticketPrice: {
        type: Number
    },
    status: {
        type: Number,
        default: 1
        //1 = active, 0 = deleted
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model("events", eventSchema);