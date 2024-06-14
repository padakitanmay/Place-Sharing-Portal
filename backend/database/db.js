import mongoose from "mongoose";

export const connectDB = async () => {
    const uri =
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.szxx1ij.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
