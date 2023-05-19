
import product from "../models/product.js";
import { MongoUtil } from "../helpers/mongoUtils.js";

const addProduct = async (req, res) => {
    try {
        const { categoryId, name, description, price } = req.body;
        const productExists = await product.findOne({ categoryId: categoryId, name: name }).lean();
        if (productExists) {
            return res.json({
                status: 400,
                error: "Menu already exists"
            });
        }
        const productData = {
            categoryId: categoryId,
            name: name,
            description: description,
            price: price
        }
        product(productData).save();
        return res.json({
            status: 200,
            message: "Menu saved successfully"
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const getProductList = async (req, res) => {
    try {
        const dbUtils = MongoUtil.getInstance();
        const productData = await dbUtils.join
            ('products', 'categories', 'categoryId', '_id', { status: 1 }, { status: 1 }, {},
                { name: 1 }, "categoryData").remove('categoryId').value();
        if (productData) {
            return res.json({
                status: 200,
                message: productData
            });
        } else {
            return res.json({
                status: 403,
                error: "No record found"
            });
        }
    }
    catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const getProductByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const productData = await product.find({ categoryId: categoryId, status: 1 }).lean();
        if (productData) {
            return res.json({
                status: 200,
                message: productData
            });
        } else {
            return res.json({
                status: 403,
                error: "No record found"
            });
        }
    }
    catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const productData = await product.findOne({ _id: productId, status: 1 });
        if (productData) {
            return res.json({
                status: 200,
                message: productData
            });
        } else {
            return res.json({
                status: 403,
                error: "No record found"
            });
        }
    }
    catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.body.productId;
        const updated = await product.findOneAndUpdate({ _id: productId }, { $set: req.body });
        if (updated) {
            return res.json({
                status: 200,
                message: "Product updated successfully"
            });
        }
        return res.json({
            status: 400,
            message: "Something went wrong"
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updated = await product.findOneAndUpdate({ _id: productId }, { $set: { status: 0 } });
        if (updated) {
            return res.json({
                status: 200,
                message: "Product deleted successfully"
            });
        }
        return res.json({
            status: 400,
            message: "Something went wrong"
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

export default {
    addProduct,
    getProductList,
    getProductByCategory,
    getProductById,
    updateProduct,
    deleteProduct
}