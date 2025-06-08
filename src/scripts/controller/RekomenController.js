import axios from 'axios';

export const getRecommendations = async (req, res) => {
  try {
    const { province, selected_labels, description } = req.body;

    if (!province || !description || !selected_labels || !Array.isArray(selected_labels)) {
      return res.status(400).json({ error: 'Provinsi, deskripsi, dan selected_labels (array) diperlukan.' });
    }

    const mlServiceUrl = 'http://127.0.0.1:5000/recommend';
    const response = await axios.post(mlServiceUrl, {
      province,
      selected_labels,
      description,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Gagal mengambil rekomendasi:', error.message);
    res.status(500).json({ error: 'Gagal mengambil rekomendasi dari layanan ML.' });
  }
};