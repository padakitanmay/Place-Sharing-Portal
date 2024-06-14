import express from "express";
import {
    createPlace,
    deletePlace,
    getPlaceByID,
    getPlacesByUserId,
    updatePlace,
} from "../controllers/place-controller.js";
import { check } from "express-validator";
import fileUpload from "../middleware/uploadFile.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/:pid", getPlaceByID);
router.get("/user/:uid", getPlacesByUserId);

router.use(checkAuth);

router.post(
    "/",
    fileUpload.single("image"),
    [
        check("title").not().isEmpty(),
        check("description").isLength({ min: 5 }),
        check("address").not().isEmpty(),
    ],
    createPlace
);

router.patch(
    "/:pid",
    [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
    updatePlace
);

router.delete("/:pid", deletePlace);

export default router;
