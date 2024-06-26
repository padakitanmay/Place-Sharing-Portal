import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import HttpError from "../models/HttpError.js";
import { User } from "../models/user-model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password");
    } catch (err) {
        return next(new HttpError("Fetching users failed", 500));
    }
    res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log("Error finding user:", err);
        return next(
            new HttpError("Signing up failed, please try again later.", 500)
        );
    }

    if (existingUser) {
        return next(
            new HttpError("User exists already, please login instead.", 422)
        );
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.log("Error hashing password:", err);
        return next(new HttpError("Could not create user", 500));
    }

    let cloudPath;
    try {
        cloudPath = await uploadOnCloudinary(req.file.path);
    } catch (err) {
        console.log("Error uploading to Cloudinary:", err);
        return next(
            new HttpError("Image upload failed, please try again later.", 500)
        );
    }

    const createdUser = new User({
        name,
        email,
        image: cloudPath.url,
        password: hashedPassword,
        places: [],
    });

    try {
        await createdUser.save();
    } catch (err) {
        console.log("Error saving user:", err);
        return next(
            new HttpError("Signing up failed, please try again later.", 500)
        );
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log("Error generating token:", err);
        return next(
            new HttpError(
                "Signing up failed, please try again later token failed.",
                500
            )
        );
    }

    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log("Error deleting file:", err);
            }
        });
    }

    res.status(201).json({
        user: createdUser.toObject({ getters: true }),
        token: token,
    });
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        return next(
            new HttpError("Logging in failed please try again later", 500)
        );
    }

    if (!existingUser) {
        return next(new HttpError("Invalid credentials", 403));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (error) {
        return next(
            new HttpError("Logging in failed please try again later", 500)
        );
    }

    if (!isValidPassword) {
        return next(new HttpError("Invalid credentials", 401));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
    } catch (error) {
        return next(
            new HttpError("Logging up failed, please try again later.", 500)
        );
    }

    res.json({
        message: "Logged in",
        user: existingUser.toObject({ getters: true }),
        token: token,
    });
};

export const deleteUser = async (req, res, next) => {
    const userId = req.params.uid;
    let user;
    try {
        user = await User.findById(userId);
        if (!user) {
            return next(
                new HttpError("Could not find a user for the provided id.", 404)
            );
        }

        await User.findByIdAndDelete(userId);
    } catch (error) {
        return next(
            new HttpError("Something went wrong, could not delete user.", 500)
        );
    }

    res.status(200).json({ message: "Deleted User" });
};
