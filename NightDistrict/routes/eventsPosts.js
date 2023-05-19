import express from 'express';
import eventsPosts from '../controllers/eventsPosts.js';
import tokenValidation from '../validation/tokenValidation.js';
const router = express.Router();

router.post('/addEventPosts', tokenValidation, eventsPosts.addEventPosts)
router.put('/updateEventPost', tokenValidation, eventsPosts.updateEventPost)
router.delete('/deleteEventPost/:postId', tokenValidation, eventsPosts.deleteEventPost)
export default router