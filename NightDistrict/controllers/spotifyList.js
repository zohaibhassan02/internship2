import SpotifyWebApi from 'spotify-web-api-node';
const spotifyApi = new SpotifyWebApi;
import Track from '../models/track.js';
import Playlist from '../models/playlist.js';
import User from '../models/users.js';

const getPlaylists = async (req, res) => {
    try{
        const user = await User.findById(req.body.id);
        const token = user.access_token;
        spotifyApi.setAccessToken(token);
        try{
            const me = await spotifyApi.getMe();
            if(me){
                    const playlists = await spotifyApi.getUserPlaylists(me.body.id);
                    if(playlists){
                        var i = [];
                        for (let data of playlists.body.items) {
                            i.push({
                                spotifyplaylistId: data.id,
                                name: data.name
                            });
                        }
                        const playlist = await Playlist.findOne({ userId: req.body.id })
                        if (playlist) {
                
                            await playlist.delete();
                        }
                        const newPlaylist = {
                            userId: req.body.id,
                            playlistsInfo: i
                        }

                        await Playlist(newPlaylist).save();
                        res.status(200).json(i); 

                    }
                    else{
                        res.json("no playlists exist");
                    }
            }
            else{
                res.status(500).json("Unable to get user");
            }
        }
        catch(err){
            res.status(401).json(err);
        }
    }
    catch(err){
        res.status(401).json(err);
    }
}


const getTracks = async (req, res) => {
    try{
        const user = await User.findById(req.body.id);
        const token = user.access_token;
        spotifyApi.setAccessToken(token);
        try{
            const tracks = await spotifyApi.getPlaylistTracks(req.params.playlistId, {
                offset: 0,
                limit: 100,
                fields: 'items'
            });
            if(tracks){
                var i = [];
                for (let data of tracks.body.items){
                    i.push({
                        spotifytrackId: data.track.id,
                        name: data.track.name,
                        artist: data.track.artists[0].name
                    });
                }
                const track = await Track.findOne({ userId: req.body.id, spotifyplaylistId: req.params.playlistId })
                if (track) {
                    await track.delete();
                }
                const newTrack = {
                    userId: req.body.id,
                    spotifyplaylistId: req.params.playlistId,
                    tracksInfo: i
                }
                await Track(newTrack).save();

                res.status(200).json(i); 
            }
            else{
                res.status(400).json("no tracks exist");
            }
        }
        catch(err){
            res.status(401).json(err);
        }
    }
    catch(err){
        res.status(401).json(err);
    }
}

export default {
    getPlaylists,
    getTracks,
}
