import Playlist from '../models/playlist.js'
import Track from '../models/track.js'

const playlists = async (req, res) => {
    try{
        if(req.body.id){
            const playlist = await Playlist.findOne({ userId: req.body.id })
            if(playlist){
                res.status(200).json(playlist)
            }
            else{
                res.status(401).json("No playlist exist")
            }
        }
        else{
            res.status(401).json("no user id provided")
        }
    }
    catch(err){
        res.status(500).json(err);
    }
}

const tracks = async (req, res) => {
    try{
        if(req.body.id){
            const tracks = await Track.findOne({ userId: req.body.id, spotifyplaylistId: req.params.playlistId })
            if(tracks){
                res.status(200).json(tracks)
            }
            else{
                res.status(401).json("No tracks exist")
            }
        }
        else{
            res.status(401).json("no user id provided")
        }
    }
    catch(err){
        res.status(500).json(err);
    }
}

const singleTrack = async (req, res) => {
    try{
        if(req.body.id){
            if(req.body.spotifyplaylistId){
                const [track] = await Track.find({userId: req.body.id, spotifyplaylistId: req.body.spotifyplaylistId, "tracksInfo.spotifytrackId": req.params.trackId }, {_id:0, tracksInfo: { $elemMatch: {spotifytrackId: req.params.trackId }}}, {"tracksInfo.$": 1});
                if(track){
                    res.status(200).json(track)
                }
                else{
                    res.status(401).json("No track exist")
                }
            }
            else{
                const [track] = await Track.find({userId: req.body.id, "tracksInfo.spotifytrackId": req.params.trackId }, {_id:0, tracksInfo: { $elemMatch: {spotifytrackId: req.params.trackId }}}, {"tracksInfo.$": 1});
                if(track){
                    res.status(200).json(track)
                }
                else{
                    res.status(401).json("No track exist")
                }
            }
        }
        else{
            res.status(401).json("no user id provided")
        }
    }
    catch(err){
        res.status(500).json(err);
    }
}

export default {
    playlists,
    tracks,
    singleTrack
}