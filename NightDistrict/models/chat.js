import mongoose from "mongoose";
const chatsSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId
    },
    message: {
        type: String
    },
    type: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    }

})
export default mongoose.model("chat", chatsSchema)