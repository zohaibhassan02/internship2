import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
    },
    status: {
        type: Number,
        default: 1
    }
});
export default mongoose.model("category", categorySchema)