import express from 'express';
import { getUsers, Login, Logout, Register } from '../controller/UsersController.js';
import { VerifyToken } from '../middleware/VerifyToken.js';
import { RefreshToken } from '../controller/RefreshToken.js';
import {getPlaceById, getPlaces} from '../controller/PlacesController.js';
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controller/WishlistController.js';
const router = express.Router();

router.get('/users', VerifyToken, getUsers);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', RefreshToken);
router.delete('/logout', Logout);
router.get('/places', getPlaces); 
router.get('/places/:id', getPlaceById);
router.get('/wishlist', VerifyToken, getUserWishlist);
router.post('/wishlist', VerifyToken, addToWishlist);
router.delete('/wishlist/:placeId', VerifyToken, removeFromWishlist);

export default router;
