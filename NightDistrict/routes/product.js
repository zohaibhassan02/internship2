import express from "express";
import product from '../controllers/product.js';
import tokenValidation from "../validation/tokenValidation.js";
const router = express.Router();

router.post('/addProduct', tokenValidation, product.addProduct)
router.get('/getProductList', tokenValidation, product.getProductList)
router.get('/getProductByCategory/:categoryId', tokenValidation, product.getProductByCategory)
router.get('/getProductById/:productId', tokenValidation, product.getProductById)
router.put('/updateProduct', tokenValidation, product.updateProduct)
router.put('/deleteProduct/:productId', tokenValidation, product.deleteProduct)
export default router