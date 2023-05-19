import express from "express";
const router = express.Router();
import spotify from "../controllers/spotify.js"
import spotifyList from "../controllers/spotifyList.js"
import tokenValidation from "../validation/tokenValidation.js";
    
router.get('/login', spotify.login);
    
router.get('/callback', spotify.callback);

router.post('/set', spotify.set);

router.get('/refresh_token', spotify.refresh_token);

router.get('/', tokenValidation, spotifyList.getPlaylists);

router.get('/:playlistId', tokenValidation, spotifyList.getTracks);

export default router;