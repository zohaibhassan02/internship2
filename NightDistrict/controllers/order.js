import order from "../models/order.js";
import helpers from '../helpers/commonHelper.js'
import mongoose from "mongoose";

const addOrder = async (req, res) => {
    try {
        var number = await order.count();
        var orderId = helpers.orderNumber(number);
        const { userId, orderDetail, totalAmount, paymentId, dateTime } = req.body;
        const orderData = {
            userId: userId,
            orderDetail: orderDetail,
            orderId: orderId,
            totalAmount: totalAmount,
            paymentId: paymentId,
            dateTime: dateTime
        };
        order(orderData).save();
        return res.json({
            status: 200,
            error: "Order successfully placed"
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

async function getOrderList(orderStatus) {
    try {
        let orderList = [];
        orderList = await order.aggregate([
            { $match: { "orderStatus": parseInt(orderStatus) } },
            { $sort: { orderStatus: 1, dateTime: 1 } },
            {
                $lookup: {
                    from: "users",
                    localField: 'userId',
                    foreignField: '_id',
                    as: "userId"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: 'orderDetail.productId',
                    foreignField: '_id',
                    as: "productData"
                }
            },
            {
                $project: {
                    "userId.email": 0, "userId.password": 0, "userId.bank": 0, "userId.phoneNo": 0, "userId.userType": 0,
                    "userId.jwtToken": 0, "productData.categoryId": 0, "productData.description": 0, "productData.price": 0,
                    "productData.status": 0, "productData.createdDate": 0,
                }
            }
        ]);
        return orderList
    }
    catch (error) {
        return error.message;
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { id, orderStatus } = req.body
        const updated = await order.findByIdAndUpdate({ _id: id }, { $set: { orderStatus: orderStatus } }, { "new": true });
        return res.json({
            status: 200,
            message: updated
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const getOrderById = async (req, res) => {
    try {
        const id = req.params.id
        let orderList = [];
        [orderList] = await order.aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "users",
                    localField: 'userId',
                    foreignField: '_id',
                    as: "userId"
                }
            },
            {
                $project: {
                    "userId.email": 0, "userId.password": 0, "userId.bank": 0, "userId.phoneNo": 0,
                    "userId.userType": 0, "userId.jwtToken": 0
                }
            }
        ]);
        return res.json({
            status: 200,
            message: orderList
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

async function getUserOrderList(userId) {
    try {
        let orderList = [];
        orderList = await order.aggregate([
            { $match: { "userId": mongoose.Types.ObjectId(userId) } },
            { $sort: { dateTime: -1 } },
            {
                $lookup: {
                    from: "products",
                    localField: 'orderDetail.productId',
                    foreignField: '_id',
                    as: "productData"
                }
            },
            {
                $project: {
                    "productData.categoryId": 0, "productData.description": 0, "productData.price": 0,
                    "productData.status": 0, "productData.createdDate": 0,
                }
            }
        ]);
        return orderList
    }
    catch (error) {
        return error.message;
    }
}

export default {
    addOrder,
    getOrderList,
    updateOrderStatus,
    getOrderById,
    getUserOrderList
}