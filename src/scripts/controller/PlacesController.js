import Places from '../models/PlaceModel.js';
import axios from 'axios';
import { Op } from 'sequelize';

export const getPlaces = async (req, res) => {
  try {
    const { province, notId, description } = req.query;
    console.log('Received query params:', { province, notId, description });

    if (description) {
      const mlServiceUrl = 'http://127.0.0.1:5000/recommend';
      try {
        const response = await axios.post(mlServiceUrl, {
          province: province || '',
          selected_labels: [], // Atau isi dengan label default jika diperlukan
          description: decodeURIComponent(description)
        }, { timeout: 5000 });// Tambahkan timeout
        console.log('Flask response:', response.data);

        if (response.data.error) {
          return res.status(404).json({ message: response.data.error });
        }

        const allPlaces = await Places.findAll({
          attributes: ['id', 'name', 'description', 'rating', 'adress', 'province', 'gambar'],
        });
        const placeMap = new Map(allPlaces.map(place => [place.name.toLowerCase(), place.id]));

        const relatedPlaces = response.data.recommendations
          .filter((place) => place.id !== parseInt(notId))
          .map((place) => {
            const dbId = placeMap.get(place.place_name.toLowerCase()) || place.id;
            console.log(`Mapping ${place.place_name} to ID: ${dbId}`);
            return {
              id: dbId,
              name: place.place_name,
              province: place.province,
              description: place.deskripsi,
              gambar: place.gambar,
              rating: place.rating || 4.5,
              adress: place.adress || null,
            };
          })
          .slice(0, 3);

        return res.status(200).json(relatedPlaces);
      } catch (flaskError) {
        console.error('Flask request failed:', flaskError.message, flaskError.stack);
        return res.status(500).json({ message: 'Failed to connect to recommendation service', error: flaskError.message });
      }
    } else {
      let where = {};
      if (province) where.province = province;
      if (notId) where.id = { [Op.ne]: notId };

      const places = await Places.findAll({
        attributes: ['id', 'name', 'description', 'rating', 'adress', 'province', 'gambar'],
        where,
      });

      const placesWithImageUrls = places.map((place) => ({
        ...place.toJSON(),
        gambar: place.gambar ? `https://capstone-backend-nvhm.vercel.app/gambar/${place.gambar}` : null,
      }));

      return res.status(200).json(placesWithImageUrls);
    }
  } catch (error) {
    console.error('Error fetching places:', error.message, error.stack);
    return res.status(500).json({ message: 'Failed to fetch places', error: error.message });
  }
};

export const getPlaceById = async (req, res) => {
  const { id } = req.params;
  try {
    const place = await Places.findOne({
      where: { id },
      attributes: ['id', 'name', 'description', 'rating', 'adress', 'province', 'gambar'],
    });
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    const placeWithImageUrl = {
      ...place.toJSON(),
      gambar: place.gambar ? `https://capstone-backend-nvhm.vercel.app/gambar/${place.gambar}` : null,
    };

    return res.status(200).json(placeWithImageUrl);
  } catch (error) {
    console.error('Error fetching place:', error);
    return res.status(500).json({ message: 'Failed to fetch place' });
  }
};