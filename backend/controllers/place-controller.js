import HttpError from "../models/HttpError.js";
import fs from "fs";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { getCoordinates } from "../utils/location.js";
import { Place } from "../models/place-model.js";
import { User } from "../models/user-model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getPlaceByID = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError("Couldn't find place", 500);
        return next(error);
    }
    if (!place) {
        return next(new HttpError("Could not find place with id", 404));
    }
    res.json({ place: place.toObject({ getters: true }) });
};

export const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        return next(new HttpError("Failed fetching palces", 500));
    }
    if (!places.length || !places) {
        return next(
            new HttpError("Could not find a place with given user ID", 404)
        );
    }
    res.json({
        places: places.map((place) => place.toObject({ getters: true })),
    });
};

export const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data", 422)
        );
    }

    const { title, description, address } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordinates(address);
    } catch (error) {
        return next(error);
    }

    const cloudPath = await uploadOnCloudinary(req.file.path);
    console.log(cloudPath);
    const createdPlace = new Place({
        title,
        description,
        location: coordinates,
        address,
        image: cloudPath.url,
        creator: req.userData.userId,
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (error) {
        return next(new HttpError("Creating place failed no user ", 500));
    }

    if (!user) {
        return next(
            new HttpError("Could not find a user for the provided id.", 404)
        );
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPlace.save({ session: session });
        user.places.push(createdPlace);
        await user.save({ session: session });
        session.commitTransaction();
    } catch (err) {
        const error = new HttpError("failed to create place", 500);
        return next(error);
    }

    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }

    res.status(201).json({ place: createdPlace });
};

export const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data", 422)
        );
    }
    const { title, description, address } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
        if (!place) {
            return next(
                new HttpError(
                    "Could not find a place for the provided id.",
                    404
                )
            );
        }
    } catch (err) {
        return next(
            new HttpError("Something went wrong, could not update place", 500)
        );
    }

    if (place.creator.toString() !== req.userData.userId) {
        return next(
            new HttpError("You are not allowed to update this place", 401)
        );
    }
    place.title = title;
    place.description = description;
    place.address = address;

    let coordinates;
    try {
        coordinates = await getCoordinates(address);
    } catch (error) {
        return next(error);
    }

    place.location = coordinates;

    try {
        await place.save();
    } catch (err) {
        return next(
            new HttpError("Something went wrong, could not update place", 500)
        );
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

export const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId).populate("creator");
    } catch (error) {
        console.error("Error finding place:", error);
        return next(
            new HttpError("Something went wrong, could not delete place.", 500)
        );
    }

    if (!place) {
        return next(
            new HttpError("Could not find a place for the provided id.", 404)
        );
    }

    if (place.creator.id !== req.userData.userId) {
        return next(
            new HttpError("You are not allowed to delete this place", 401)
        );
    }

    const imagePath = place.image;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        await Place.findByIdAndDelete(placeId, { session: session });
        await place.creator.places.pull(place);
        await place.creator.save({ session: session });

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        console.error("Error during transaction:", error);
        return next(
            new HttpError("Something went wrong, could not delete place.", 500)
        );
    }

    fs.unlink(imagePath, (err) => {
        console.log(err);
    });

    res.status(200).json({ message: "Deleted place" });
};
