import mongoose from "mongoose";
const trackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    spotifyplaylistId: {
        type: String,
        required: true
    },
    tracksInfo: [{
        spotifytrackId: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        artist: {
            type: String
        },
        voted: {
            type: Array,
            default: []
        }, 
        downvoted: {
            type: Array,
            default: []
        }
    }]

});
export default mongoose.model("track", trackSchema)