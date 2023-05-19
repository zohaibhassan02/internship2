import mongoose from "mongoose";
const productSchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    status: {
        type: Number,
        default: 1
        //1 = active, 2 = suspend, 3 = deleted
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
});
export default mongoose.model('product', productSchema);