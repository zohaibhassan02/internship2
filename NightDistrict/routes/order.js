import express from 'express';
import order from '../controllers/order.js';
import tokenValidation from '../validation/tokenValidation.js';
const  router =  express.Router();

router.post('/addOrder', tokenValidation,  order.addOrder)
router.get('/getOrderList/:orderStatus', tokenValidation,  order.getOrderList)
router.put('/updateOrderStatus', tokenValidation,  order.updateOrderStatus)
router.get('/getOrderById/:id', tokenValidation,  order.getOrderById)
export default router