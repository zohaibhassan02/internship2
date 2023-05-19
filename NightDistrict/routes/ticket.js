import express from 'express';
const router = express.Router();
import controller from '../controllers/ticket.js'
import tokenValidation from '../validation/tokenValidation.js';

router.post('/', controller.add);

export default router;