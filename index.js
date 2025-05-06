// index.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World'); // This should display "Hello World" on the browser
});


app.get('/mood', async (req, res) => {
    const query = req.query.query || 'calm';
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query, per_page: 5 },
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_KEY}` }
        });

        const urls = response.data.results.map(img => img.urls.small);
        res.send(`<h2>Mood: ${query}</h2>` + urls.map(url => `<img src="${url}" style="margin:10px" />`).join(''));
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error fetching images from Unsplash.");
    }
});

app.listen(PORT, () => {
    console.log(`MoodBoard running at http://localhost:${PORT}`);
});
