import express from "express";

import { isAuthenticated } from "../middlewares/apiAuthMiddleware.js";
import { findRoom } from "../controllers/room.js";

const router = express.Router();

router.get("/:roomId", isAuthenticated, findRoom);

export default router;