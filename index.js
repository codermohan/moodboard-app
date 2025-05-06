const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

app.use(express.json());

// ✅ Welcome route
app.get('/', (req, res) => {
  res.send('<h1>👋 Welcome to MoodBoard API</h1><p>Try visiting <code>/mood</code> or other endpoints.</p>');
});

// ✅ Mood route
app.get('/mood', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/random?query=mood&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    res.json({
      image: response.data.urls.small,
      description: response.data.alt_description,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching image from Unsplash' });
  }
});

// ✅ Fallback route for 404
app.use((req, res) => {
  res.status(404).send('<h2>404 - Not Found</h2><p>This route does not exist.</p>');
});

app.listen(PORT, () => {
  console.log(`✅ MoodBoard running at http://localhost:${PORT}`);
});

