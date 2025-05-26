import express from 'express';
import { getUsers, Login, Logout, Register } from '../controller/UsersController.js';
import { VerifyToken } from '../middleware/VerifyToken.js';
import { RefreshToken } from '../controller/RefreshToken.js';

const router = express.Router();

router.get('/users', VerifyToken, getUsers);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', RefreshToken);
router.delete('/logout', Logout);

export default router;