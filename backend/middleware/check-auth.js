import HttpError from "../models/HttpError.js";
import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error("Invalid authorization");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (error) {
        return next(new HttpError("Authentication failed", 403));
    }
};

export default checkAuth;