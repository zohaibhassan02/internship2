import express from 'express';
const router = express.Router();
import list from '../controllers/list.js'
import tokenValidation from '../validation/tokenValidation.js';

router.get('/', tokenValidation, list.playlists);

router.get('/playlist/:playlistId', tokenValidation, list.tracks);

router.get('/track/:trackId', tokenValidation, list.singleTrack);

export default router;