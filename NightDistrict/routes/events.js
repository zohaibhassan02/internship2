import express from 'express';
import events from '../controllers/events.js';
import tokenValidation from '../validation/tokenValidation.js';
const router = express.Router();

router.post('/addEvent', tokenValidation, events.addEvent)
router.get('/getUpcommingEvents', tokenValidation, events.getUpcommingEvents)
router.get('/getEventById/:eventId', tokenValidation, events.getEventById)
router.get('/getUserEvents/:userId', tokenValidation, events.getUserEvents)
router.put('/updateEvent', tokenValidation, events.updateEvent)
router.put('/deleteEvent/:eventId', tokenValidation, events.deleteEvent)
router.get('/getEventByDate', tokenValidation, events.getEventByDate)
export default router