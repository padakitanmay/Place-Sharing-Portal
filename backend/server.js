import express from "express";
import path from "path";
import bodyParser from "body-parser";
// import dotenv from "dotenv/config";
import fs from "fs";

import placeRoutes from "./routes/place-routes.js";
import userRoutes from "./routes/user-routes.js";
import HttpError from "./models/HttpError.js";
import { connectDB } from "./database/db.js";


const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    next();
});
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);
app.use((req, res, next) => {
    const error = new HttpError("Cound not found route", 404);
    throw error;
});
app.use((error, req, res, next) => {
    // if (req.file) {
    //     fs.unlink(req.file.path, (err) => {
    //         console.log(err);
    //     });
    // }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "Unknown error" });
});

connectDB();
app.listen(5000);
