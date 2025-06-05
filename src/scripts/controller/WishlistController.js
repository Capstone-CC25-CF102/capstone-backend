import Wishlist from '../models/WishlistModel.js';
import Places from '../models/PlaceModel.js';
import Users from '../models/UserModel.js';

export const getUserWishlist = async (req, res) => {
  const userEmail = req.user;

  try {
    const user = await Users.findOne({ where: { email: userEmail } });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const wishlists = await Wishlist.findAll({
      where: { userId: user.id },
      include: {
        model: Places,
        attributes: ['id', 'name', 'description', 'rating', 'adress', 'province', 'gambar'],
      },
    });

    const formatted = wishlists.map((item) => ({
      ...item.place.toJSON(),
      gambar: item.place.gambar ? `http://localhost:5000/gambar/${item.place.gambar}` : null
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


export const addToWishlist = async (req, res) => {
  console.log(req.user)
  const userEmail = req.user;
  const { placeId } = req.body;

  try {
    const user = await Users.findOne({ where: { email: userEmail } });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const existing = await Wishlist.findOne({ where: { userId: user.id, placeId } });
    if (existing) return res.status(400).json({ msg: 'Place already in wishlist' });

    await Wishlist.create({ userId: user.id, placeId });
    res.status(201).json({ msg: 'Added to wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const removeFromWishlist = async (req, res) => {
  const userEmail = req.user;
  const placeId = parseInt(req.params.placeId);
  

  try {
    const user = await Users.findOne({ where: { email: userEmail } });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const deleted = await Wishlist.destroy({
      where: { userId: user.id, placeId }
    });

    if (!deleted) return res.status(404).json({ msg: 'Item not found' });
    res.json({ msg: 'Removed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};
