import mongoose from "mongoose"
const usersSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bank:{
        type : String,
    },
    phoneNo: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: ''
    },
    userType: {
        type: Number,
        required: true
        //1 = superadmin, 2 = admin, 3 = bartender, 4 = dj, 5 = customer
    },
    otpCode: {
        type: String
    },
    jwtToken: {
        type: String
    },
    fcmToken: {
        type: String
    },
    access_token: {
        type: String,
        default: ''
    },
    refresh_token: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 1
    }
});
export default mongoose.model('users', usersSchema);