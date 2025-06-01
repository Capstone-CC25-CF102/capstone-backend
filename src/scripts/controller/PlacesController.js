import Places from '../models/PlaceModel.js';

export const getPlaces = async (req, res) => {
  try {
    const places = await Places.findAll({
      attributes: ['id', 'name', 'description','rating', 'adress', 'province', 'gambar'],
    });
   const placesWithImageUrls = places.map(place => ({
      ...place.toJSON(),
      gambar: place.gambar ? `http://localhost:5000/gambar/${place.gambar}` : null
    }));
    
    return res.status(200).json(placesWithImageUrls);
  } catch (error) {
    console.error('Error fetching places:', error);
    return res.status(500).json({ message: 'Failed to fetch places' });
  }
};

export const getPlaceById = async (req, res) => {
  const { id } = req.params;
  try {
    const place = await Places.findOne({
      where: { id },
      attributes: ['id', 'name', 'description','rating', 'adress', 'province', 'gambar'],
    });
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    const placeWithImageUrl = {
      ...place.toJSON(),
      gambar: place.gambar ? `http://localhost:5000/gambar/${place.gambar}` : null
    };
    
    return res.status(200).json(placeWithImageUrl);
  } catch (error) {
    console.error('Error fetching place:', error);
    return res.status(500).json({ message: 'Failed to fetch place' });
  }
};

