import express from "express";
import users from "../controllers/users.js";
import tokenValidation from "../validation/tokenValidation.js";
const router = express.Router();

router.post("/register", users.register);
router.post("/login", users.login);
router.put("/logout/:id", tokenValidation, users.logout);
router.put("/updateUsersProfile", tokenValidation, users.updateUsersProfile);
router.put("/forgetPasswordOtp", users.forgetPasswordOtp);
router.put("/forgetPassword", users.forgetPassword);
router.put("/changePassword", tokenValidation, users.changePassword);
router.post("/updateProfilePic", tokenValidation, users.updateProfilePic);
router.get("/getLoggedInUsersProfileById/:id", tokenValidation, users.getLoggedInUsersProfileById);
export default router;