import mongoose from "mongoose";
const playlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    playlistsInfo: [{
        spotifyplaylistId: {
            type: String
        },
        name: { 
            type: String 
        }
    }]
});
export default mongoose.model("playlist", playlistSchema)