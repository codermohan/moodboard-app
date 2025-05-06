require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Moodboard App 🌈</h1>
    <p>Choose a mood:</p>
    <ul>
      <li><a href="/mood/happy">Happy</a></li>
      <li><a href="/mood/sad">Sad</a></li>
      <li><a href="/mood/excited">Excited</a></li>
      <li><a href="/mood/calm">Calm</a></li>
    </ul>
  `);
});

app.get('/mood/:type', async (req, res) => {
  const moodType = req.params.type;

  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/random?query=${moodType}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const imageUrl = response.data.urls.regular;

    res.send(`
      <h1>${moodType.charAt(0).toUpperCase() + moodType.slice(1)} Mood</h1>
      <img src="${imageUrl}" alt="${moodType} image" width="600" />
      <p><a href="/">Back to Welcome</a></p>
    `);
  } catch (error) {
    res.status(500).send("Error fetching image from Unsplash.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Moodboard app running at http://localhost:${PORT}`);
});

