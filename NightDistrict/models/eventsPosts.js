import mongoose from "mongoose";
const eventsPostsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId
    },
    description: {
        type: String
    },
    images: [
        {
            image: {
                type: String
            }
        }
    ],
    status: {
        type: Number,
        default: 1
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model("eventsPosts", eventsPostsSchema);