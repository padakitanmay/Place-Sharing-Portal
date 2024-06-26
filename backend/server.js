import express from "express";
import path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv/config";
import fs from "fs";
import cors from "cors";

import placeRoutes from "./routes/place-routes.js";
import userRoutes from "./routes/user-routes.js";
import HttpError from "./models/HttpError.js";
import { connectDB } from "./database/db.js";

const app = express();

// Configure CORS
const corsOptions = {
    origin: "*", // Allow requests from all origins
    methods: "GET,PATCH,POST,DELETE", // Allow all HTTP methods
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization", // Allow these headers
    credentials: true, // Allow sending cookies across origins
  };
  
  // middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Body parser middleware
// app.use(bodyParser.json({ limit: "50mb" })); // for JSON requests
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // for URL-encoded requests

// Serve static files
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// API routes
app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

// Handling unsupported routes
app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.error(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

// Connect to the database and start the server
connectDB();

const PORT = process.env.PORT || 5000; // Use environment variable if available
// const HOST = '0.0.0.0'; // Listen on all network interfaces
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});