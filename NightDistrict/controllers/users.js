import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import users from "../models/users.js";
import emailHelper from "../helpers/emailHelper.js"
import fs from "fs";

const register = async (req, res) => {
    try {
        let email = req.body.email.toLowerCase();
        let imageName = "";
        if (req.body == undefined) {
            return res.json({
                status: 400,
                error: error.message
            });
        }
        const userExists = await users.findOne({ email });
        if (userExists) {
            return res.json({
                status: 400,
                error: "User already exists"
            });
        }
        if (req.files) {
            const coverPic = req.files.coverPic;
            const dir = "public/uploads/usersProfilePic"
            imageName = `${dir}/${Date.now()}_` + coverPic.name;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            coverPic.mv(imageName, (error) => {
                if (error) {
                    return res.json({
                        status: 500,
                        error: error.message
                    });
                }
            });
        }
        const password = await bcrypt.hash(req.body.password, 10);
        const customerData = {
            fullName: req.body.fullName,
            email: email,
            password: password,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            bank: req.body.bank,
            userType: req.body.userType,
        };
        await users(customerData).save().then(async (response) => {
            const jwtToken = jwt.sign({ id: response._id, email: response.email }, process.env.JWT_TOKEN);
            await users.updateOne({ _id: response._id }, { $set: { jwtToken: jwtToken } }),
                response.password = undefined;
            response.jwtToken = jwtToken;
            return res.json({
                status: 200,
                message: response
            });
        }).catch(error => {
            return res.json({
                status: 500,
                error: error.message
            });
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        users.findOne({ email }, async (error, userData) => {
            if (!userData) {
                return res.json({
                    status: 404,
                    error: "Email is invalid"
                });
            }
            const isPassword = await bcrypt.compare(password, userData.password);
            if (isPassword) {
                const jwtToken = jwt.sign({ id: userData._id, email: userData.email }, process.env.JWT_TOKEN);
                users.updateOne({ _id: userData._id }, { $set: { jwtToken: jwtToken } }, (error, response) => {
                    if (error) {
                        return res.json({
                            status: 500,
                            error: error.message
                        });
                    }
                    userData.password = undefined;
                    userData.jwtToken = jwtToken;
                    return res.json({
                        status: 200,
                        message: userData
                    });
                });
            } else {
                return res.json({
                    status: 400,
                    error: "Password is incorrect"
                });
            }
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const logout = (req, res) => {
    try {
        if (req.params.id == undefined) {
            return res.json({
                status: 400,
                error: error.message
            });
        }
        users.updateOne({ _id: req.params.id }, { $set: { jwtToken: "", fcmToken: "" } }, (error, response) => {
            if (error) {
                return res.json({
                    status: 500,
                    error: error.message
                });
            }
        });
        return res.json({
            status: 200,
            message: 'Logged out successfully'
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const updateUsersProfile = async (req, res) => {
    try {
        if (req.body == undefined) {
            return res.json({
                status: 400,
                error: "Something went wrong"
            });
        }
        users.updateOne({ _id: req.body.id }, { $set: req.body }, (error, response) => {
            if (error) {
                return res.json({
                    status: 400,
                    error: error.message
                });
            }
        });
        const userData = await users.findOne({ _id: req.body.id }).lean();
        userData.password = undefined;
        return res.json({
            status: 200,
            message: userData
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

const forgetPasswordOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await users.findOne({ email }).lean();
        if (!userData) {
            return res.json({
                status: 404,
                error: "invalid Email"
            });
        }
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        emailHelper.sendResetPasswordEmail(randomNumber, userData.email, userData.fullName, (error, response) => {
            if (error) {
                return res.json({
                    status: 500,
                    error: error.message
                });
            }
            users.updateOne({ email: email }, { $set: { otpCode: randomNumber } }, (error, response) => {
                if (error) {
                    return res.json({
                        status: 400,
                        error: error.message
                    });
                }
                return res.json({
                    status: 200,
                    message: {
                        email: users.email,
                        code: randomNumber
                    }
                });
            });
        });
    } catch (error) {
        return res.json({
            status: 400,
            error: error.message
        });
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email, password, otpCode } = req.body;
        const userData = await users.findOne({ otpCode }).lean();
        if (!userData) {
            return res.json({
                status: 400,
                error: "Invalid OTP Code"
            });
        }
        if (userData.email !== email) {
            return res.json({
                status: 400,
                error: "Invalid Email"
            });
        }
        if (password == "") {
            return res.json({
                status: 404,
                error: "Password is required"
            });
        }
        const hashpassword = await bcrypt.hash(password, 10);

        users.updateOne({ email: email }, { $set: { password: hashpassword, otpCode: '' } }, (error, response) => {
            if (error) {
                return res.json({
                    status: 500,
                    error: error.message
                });
            }
            return res.json({
                status: 200,
                message: "Your password has been changed successfully",
            });
        });
    } catch (error) {
        return res.json({
            status: 400,
            error: error.message
        });
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (password == "") {
            return res.json({
                status: 404,
                error: "Password is required"
            });
        }
        const hashpassword = await bcrypt.hash(password, 10);
        users.findOne({ email }, async (error, customerData) => {
            if (!customerData) {
                return res.json({
                    status: 404,
                    error: "Email is invalid"
                });
            }
            users.updateOne({ email: email }, { $set: { password: hashpassword } }, (error, response) => {
                if (error) {
                    return res.json({
                        status: 500,
                        error: error.message
                    });
                }
                return res.json({
                    status: 200,
                    message: "Your password has been changed successfully",
                });
            });
        });
    } catch (error) {
        return res.json({
            status: 400,
            error: error.message
        });
    }
}

const updateProfilePic = async (req, res) => {
    try {
        let imageName = "";
        const userData = await users.findById(req.body.id);
        if (req.files) {
            const profilePic = req.files.profilePic;
            if (userData.profilePic != '') {
                if (fs.existsSync(`./public${userData.profilePic}`)) {
                    fs.unlinkSync(`./public${userData.profilePic}`);
                }
            }
            const dir = "public/uploads/usersProfilePic"
            imageName = `${dir}/${Date.now()}_` + profilePic.name;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            profilePic.mv(imageName, (error) => {
                if (error) {
                    return res.json({
                        status: 500,
                        error: error.message
                    });
                }
            });
            users.updateOne({ _id: req.body.id }, { $set: { profilePic: imageName.replace("public", "") } }, (error, response) => {
                if (error) {
                    return res.json({
                        status: 500,
                        error: error.message
                    });
                }
            });
            return res.json({
                status: 200,
                message: "Your Profile Picture updated successfully"
            });
        }
        return res.json({
            status: 404,
            error: "Please select your image"
        });
    } catch (error) {
        return res.json({
            status: 400,
            error: error.message
        });
    }
}

const getLoggedInUsersProfileById = async (req, res) => {
    try {
        const id = req.params.id;
        let [customerData] = await users.find({ _id: id });
        return res.json({
            status: 200,
            message: customerData
        });
    } catch (error) {
        return res.json({
            status: 500,
            error: error.message
        });
    }
}

export default {
    register,
    login,
    logout,
    updateUsersProfile,
    forgetPasswordOtp,
    forgetPassword,
    changePassword,
    updateProfilePic,
    getLoggedInUsersProfileById
}
