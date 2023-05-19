import category from "../models/category.js";
import fs from "fs";

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const duplicate = await category.findOne({ name: name, status: 1 });
        if (duplicate) {
            return res.json({
                status: 400,
                error: "Event already exists"
            });
        }
        else {
            let imageName = '';
            if (req.files) {
                const image = req.files.image;
                const dir = "public/uploads/categoryImages"
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
            const data = new category({
                name,
                description,
                image: imageName.replace("public", "")
            })
            await data.save();
            return res.json({
                status: 200,
                message: "Category successfully saved"
            });
        }
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const getCategory = async (req, res) => {
    try {
        let categoryList
        const id = req.params.id;
        if (id) {
            categoryList = await category.find({ _id: id, status: 1 }).lean();
        } else {
            categoryList = await category.find({ status: 1 }).lean();
        }
        if (!categoryList) {
            return res.json({
                status: 400,
                error: "Something went wrong"
            });
        }
        return res.json({
            status: 200,
            message: categoryList
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        let imageName = '';
        if (req.files) {
            const image = req.files.image;
            const categoryData = await category.findOne({ _id: id });
            if (categoryData.image != '') {
                if (fs.existsSync(`./public${categoryData.image}`)) {
                    fs.unlinkSync(`./public${categoryData.image}`);
                }
            }
            const dir = "public/uploads/categoryImages"
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
        const updated = await category.findByIdAndUpdate(id, {
            $set: { "name": name, "description": description, 'image': imageName.replace("public", "") }
        }, { "new": true });
        if (updated) {
            return res.json({
                status: 200,
                message: 'Category successfully deleted'
            });
        }
        return res.json({
            status: 400,
            error: "Something went wrong"
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const updated = await category.findByIdAndUpdate(id, {
            $set: {
                status: 0
            }
        });
        if (updated) {
            return res.json({
                status: 200,
                message: 'Category successfully deleted'
            });
        }
        return res.json({
            status: 400,
            error: "Something went wrong"
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

export default {
    addCategory,
    getCategory,
    updateCategory,
    deleteCategory
}