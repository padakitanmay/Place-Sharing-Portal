import express from "express";
import { check } from "express-validator";
import {
    deleteUser,
    getUsers,
    login,
    signup,
} from "../controllers/user-controller.js";
import fileUpload from "../middleware/uploadFile.js";

const router = express.Router();

router.get("/", getUsers);

router.post(
    "/signup",
    fileUpload.single("image"),
    [
        check("name").not().isEmpty(),
        check("email").normalizeEmail().isEmail(),
        check("password").isLength({ min: 6 }),
    ],
    signup
);
router.post("/login", login);

router.delete("/delete/:uid", deleteUser);

export default router;
