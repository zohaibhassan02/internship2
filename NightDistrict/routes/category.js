import express from 'express';
import category from '../controllers/category.js';
import tokenValidation from '../validation/tokenValidation.js';
const  router =  express.Router();

router.post('/addCategory', tokenValidation,  category.addCategory)
router.get('/getCategory/:id?',  tokenValidation , category.getCategory)
router.put('/updateCategory', tokenValidation , category.updateCategory)
router.put('/deleteCategory/:id', tokenValidation , category.deleteCategory)
export default router