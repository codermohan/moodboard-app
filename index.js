require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Root route - Welcome Message
app.get('/', (req, res) => {
  res.send(`
    <h1>🎨 Welcome to the MoodBoard API</h1>
    <p>Use the endpoint <code>/mood/:moodType</code> to get images based on a mood.</p>
    <p>Example: <a href="/mood/happy">/mood/happy</a> or <a href="/mood/sad">/mood/sad</a></p>
  `);
});

// Dynamic mood route
app.get('/mood/:type', async (req, res) => {
  const mood = req.params.type;

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: mood,
        per_page: 10,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    const images = response.data.results.map(photo => ({
      description: photo.alt_description,
      url: photo.urls.small,
      photographer: photo.user.name,
      profile: photo.user.links.html,
    }));

    res.json({
      mood,
      count: images.length,
      images,
    });

  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).json({ error: 'Failed to fetch images from Unsplash' });
  }
});

app.listen(PORT, () => {
  console.log(`MoodBoard running at http://localhost:${PORT}`);
});

