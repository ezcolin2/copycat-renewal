import express from "express";

import { isAuthenticated } from "../middlewares/apiAuthMiddleware.js";
import { uploadImage, getImage, getPoseObject, uploadPoseObject } from "../controllers/image.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post("/", isAuthenticated, upload.single("image"), uploadImage);
router.get("/:roomId", isAuthenticated, getImage);
router.post("/poses", isAuthenticated, uploadPoseObject);
router.get("/poses/:roomId", isAuthenticated, getPoseObject);

export default router;