import express from "express";

import { isAuthenticated } from "../middlewares/apiAuthMiddleware.js";
import { uploadImage, getImage } from "../controllers/image.js";

const router = express.Router();

router.post("/:roomId", isAuthenticated, uploadImage);
router.get("/:imageId", isAuthenticated, getImage);

export default router;