import eventsPosts from "../models/eventsPosts.js";
import fs from "fs";
import mongoose from "mongoose";

const addEventPosts = async (req, res) => {
    try {
        const { userId, eventId, description } = req.body;
        let imageName = [];
        let imagePath = [];
        if (req.files) {
            const images = req.files.images;
            for (var i = 0; i < images.length; i++) {
                let file = images[i];
                const dir = "public/uploads/eventPostsimages"
                let imageName = `${dir}/${Date.now()}_ ` + file.name;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                file.mv(imageName, (error) => {
                    if (error) {
                        return res.json({
                            status: 500,
                            error: error.message
                        });
                    }
                });
                imageName = imageName.replace("public", "");
                imagePath.push({ image: imageName });
            }
        }
        const eventPostsData = {
            userId: userId,
            eventId: eventId,
            description: description,
            images: imagePath
        };
        await eventsPosts(eventPostsData).save();
        return res.json({
            status: 200,
            message: 'Post added successfully'
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const updateEventPost = async (req, res) => {
    try {
        const { userId, eventId, description } = req.body;
        let imageName = [];
        let imagePath = [];
        if (req.files) {
            const images = req.files.images;
            for (var i = 0; i < images.length; i++) {
                let file = images[i];
                const dir = "public/uploads/eventPostsimages"
                let imageName = `${dir}/${Date.now()}_ ` + file.name;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                file.mv(imageName, (error) => {
                    if (error) {
                        return res.json({
                            status: 500,
                            error: error.message
                        });
                    }
                });
                imageName = imageName.replace("public", "");
                imagePath.push({ image: imageName });
            }
        }
        const eventPostsData = {
            userId: userId,
            eventId: eventId,
            description: description,
            images: imagePath
        };
        await eventsPosts(eventPostsData).save();
        return res.json({
            status: 200,
            message: 'Post added successfully'
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const deleteEventPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const postData = await eventsPosts.findByIdAndDelete({ _id: mongoose.Types.ObjectId(postId) });
        if (!postData) {
            return res.json({
                status: 400,
                error: "Something went wrong"
            });
        }
        return res.json({
            status: 200,
            message: "Post successfully deleted"
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

export default {
    addEventPosts,
    updateEventPost,
    deleteEventPost
}