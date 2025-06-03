import express from 'express';
import { getUsers, Login, Logout, Register } from '../controller/UsersController.js';
import { VerifyToken } from '../middleware/VerifyToken.js';
import { RefreshToken } from '../controller/RefreshToken.js';
import {getPlaceById, getPlaces} from '../controller/PlacesController.js';

const router = express.Router();

router.get('/users', VerifyToken, getUsers);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', RefreshToken);
router.delete('/logout', Logout);
router.get('/places', getPlaces); 
router.get('/places/:id', getPlaceById);

export default router;


