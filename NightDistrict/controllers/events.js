import events from "../models/events.js";
import commonHelper from "../helpers/commonHelper.js";
import mongoose from "mongoose";
import fs from "fs";

const addEvent = async (req, res) => {
    try {
        req.body.djPerforming = JSON.parse(req.body.djPerforming);
        const { name, description, eventDateTime, createdByUserId, djPerforming, ticketPrice } = req.body;
        const eventExist = await events.findOne({ name: name, eventDateTime: eventDateTime });
        if (eventExist) {
            return res.json({
                status: 400,
                error: "Event already exists"
            });
        }
        let imageName = '';
        if (req.files) {
            const image = req.files.image;
            const dir = "public/uploads/eventsImages"
            imageName = `${dir}/${Date.now()}_` + image.name;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            image.mv(imageName, (error) => {
                if (error) {
                    return res.json({
                        status: 500,
                        error: error.message
                    });
                }
            });
        }
        const eventData = {
            name: name,
            description: description,
            eventDateTime: eventDateTime,
            createdByUserId: createdByUserId,
            djPerforming: djPerforming,
            image: imageName.replace("public", ""),
            ticketPrice: ticketPrice
        };
        await events(eventData).save();
        return res.json({
            status: 200,
            message: 'Event created successfully'
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const getUpcommingEvents = async (req, res) => {
    try {
        const { page, limit } = req.query;
        let results = [];
        const eventsData = await events.aggregate([
            { $match: { eventDateTime: { $gt: new Date(Date.now()) }, status: 1 } },
            {
                $lookup: {
                    from: "eventsposts",
                    localField: "_id",
                    foreignField: "eventId",
                    as: "eventsPosts"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdByUserId",
                    foreignField: "_id",
                    as: "createdByUserId"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "eventsPosts.userId",
                    foreignField: "_id",
                    as: "postUserData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "djPerforming.userId",
                    foreignField: "_id",
                    as: "djUserData"
                }
            },
            {
                $project: {
                    'postUserData.jwtToken': 0, 'postUserData.userType': 0, 'postUserData.phoneNo': 0, 'postUserData.bank': 0,
                    'postUserData.password': 0, 'postUserData.email': 0,
                    'djUserData.jwtToken': 0, 'djUserData.userType': 0, 'djUserData.phoneNo': 0, 'djUserData.bank': 0,
                    'djUserData.password': 0, 'djUserData.email': 0,
                    'createdByUserId.jwtToken': 0, 'createdByUserId.userType': 0, 'createdByUserId.phoneNo': 0, 'createdByUserId.bank': 0,
                    'createdByUserId.password': 0, 'createdByUserId.email': 0
                }
            }
        ]);
        results = commonHelper.pagination(parseInt(page), parseInt(limit), eventsData);
        return res.json({
            status: 200,
            message: results
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const getEventById = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventsData = await events.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(eventId), status: 1 } },
            {
                $lookup: {
                    from: "eventsposts",
                    localField: "_id",
                    foreignField: "eventId",
                    as: "eventsPosts"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdByUserId",
                    foreignField: "_id",
                    as: "createdByUserId"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "eventsPosts.userId",
                    foreignField: "_id",
                    as: "postUserData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "djPerforming.userId",
                    foreignField: "_id",
                    as: "djUserData"
                }
            },
            {
                $project: {
                    'postUserData.jwtToken': 0, 'postUserData.userType': 0, 'postUserData.phoneNo': 0, 'postUserData.bank': 0,
                    'postUserData.password': 0, 'postUserData.email': 0,
                    'djUserData.jwtToken': 0, 'djUserData.userType': 0, 'djUserData.phoneNo': 0, 'djUserData.bank': 0,
                    'djUserData.password': 0, 'djUserData.email': 0,
                    'createdByUserId.jwtToken': 0, 'createdByUserId.userType': 0, 'createdByUserId.phoneNo': 0, 'createdByUserId.bank': 0,
                    'createdByUserId.password': 0, 'createdByUserId.email': 0
                }
            }
        ]);
        return res.json({
            status: 200,
            message: eventsData
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const getUserEvents = async (req, res) => {
    try {
        const userId = req.params.userId;
        const eventsData = await events.aggregate([
            { $match: { createdByUserId: mongoose.Types.ObjectId(userId), status: 1 } },
            {
                $lookup: {
                    from: "eventsposts",
                    localField: "_id",
                    foreignField: "eventId",
                    as: "eventsPosts"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdByUserId",
                    foreignField: "_id",
                    as: "createdByUserId"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "eventsPosts.userId",
                    foreignField: "_id",
                    as: "postUserData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "djPerforming.userId",
                    foreignField: "_id",
                    as: "djUserData"
                }
            },
            {
                $project: {
                    'postUserData.jwtToken': 0, 'postUserData.userType': 0, 'postUserData.phoneNo': 0, 'postUserData.bank': 0,
                    'postUserData.password': 0, 'postUserData.email': 0,
                    'djUserData.jwtToken': 0, 'djUserData.userType': 0, 'djUserData.phoneNo': 0, 'djUserData.bank': 0,
                    'djUserData.password': 0, 'djUserData.email': 0,
                    'createdByUserId.jwtToken': 0, 'createdByUserId.userType': 0, 'createdByUserId.phoneNo': 0, 'createdByUserId.bank': 0,
                    'createdByUserId.password': 0, 'createdByUserId.email': 0
                }
            }
        ]);
        return res.json({
            status: 200,
            message: eventsData
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const updateEvent = async (req, res) => {
    try {
        req.body.djPerforming = JSON.parse(req.body.djPerforming);
        const { eventId, name, description, eventDateTime, createdByUserId, djPerforming, ticketPrice } = req.body;
        const eventData = await events.findOne({ eventId: eventId });

        let imageName = '';
        if (req.files) {
            const image = req.files.image;
            if (eventData.image != '') {
                if (fs.existsSync(`./public${eventData.image}`)) {
                    fs.unlinkSync(`./public${eventData.image}`);
                }
            }
            const dir = "public/uploads/eventsImages"
            imageName = `${dir}/${Date.now()}_` + image.name;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            image.mv(imageName, (error) => {
                if (error) {
                    return res.json({
                        status: 500,
                        error: error.message
                    });
                }
            });
        }
        const updated = await events.findByIdAndUpdate({ _id: eventId }, {
            $set: {
                'name': name, 'description': description, 'eventDateTime': eventDateTime, 'createdByUserId': createdByUserId,
                'djPerforming': djPerforming, 'image': imageName.replace("public", ""), 'ticketPrice': ticketPrice
            }
        }, { new: "true" });
        if (!updated) {
            return res.json({
                status: 400,
                error: "Something went wrong"
            });
        }
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

const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventData = await events.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(eventId) }, {
            $set: {
                status: 0
            }
        });
        if (!eventData) {
            return res.json({
                status: 400,
                error: "Something went wrong"
            });
        }
        return res.json({
            status: 200,
            message: "Event successfully deleted"
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const getEventByDate = async (req, res) => {
    try {
        const { page, limit, eventDateTime } = req.query;
        let results = [];
        const eventsData = await events.aggregate([
            { $match: { eventDateTime: { $gte: new Date(`${eventDateTime}T00:00:00.000Z`), $lte: new Date(`${eventDateTime}T23:59:59.999Z`) }, status: 1 } },
            {
                $lookup: {
                    from: "eventsposts",
                    localField: "_id",
                    foreignField: "eventId",
                    as: "eventsPosts"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdByUserId",
                    foreignField: "_id",
                    as: "createdByUserId"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "eventsPosts.userId",
                    foreignField: "_id",
                    as: "postUserData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "djPerforming.userId",
                    foreignField: "_id",
                    as: "djUserData"
                }
            },
            {
                $project: {
                    'postUserData.jwtToken': 0, 'postUserData.userType': 0, 'postUserData.phoneNo': 0, 'postUserData.bank': 0,
                    'postUserData.password': 0, 'postUserData.email': 0,
                    'djUserData.jwtToken': 0, 'djUserData.userType': 0, 'djUserData.phoneNo': 0, 'djUserData.bank': 0,
                    'djUserData.password': 0, 'djUserData.email': 0,
                    'createdByUserId.jwtToken': 0, 'createdByUserId.userType': 0, 'createdByUserId.phoneNo': 0, 'createdByUserId.bank': 0,
                    'createdByUserId.password': 0, 'createdByUserId.email': 0
                }
            }
        ]);
        results = commonHelper.pagination(parseInt(page), parseInt(limit), eventsData);
        return res.json({
            status: 200,
            message: results
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

export default {
    addEvent,
    getUpcommingEvents,
    getEventById,
    getUserEvents,
    updateEvent,
    deleteEvent,
    getEventByDate
}