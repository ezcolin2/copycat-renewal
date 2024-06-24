import express from 'express';
import {createSession, enterSession} from '../controllers/openvidu.js';
import { isAuthenticated } from '../middlewares/apiAuthMiddleware.js';
const router = express.Router();

router.post('/:sessionId', isAuthenticated, enterSession);
router.post('/', isAuthenticated, createSession);


export default router;