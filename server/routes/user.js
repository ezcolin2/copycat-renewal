import express from 'express';

import { isAuthenticated, isNotAuthenticated } from '../middlewares/apiAuthMiddleware.js';
import {joinUser, loginUser, logoutUser, getMyInfo} from '../controllers/user.js';

const router = express.Router();

router.post('/join', isNotAuthenticated, joinUser);

router.post('/login', isNotAuthenticated, loginUser);

router.get('/logout', isAuthenticated, logoutUser);

router.get('/myself', isAuthenticated, getMyInfo)

export default router;
