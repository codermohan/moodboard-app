#!/bin/bash

# Ensure Node.js version is 18 or higher
REQUIRED_NODE_MAJOR=18
NODE_MAJOR=$(node -v | cut -d. -f1 | tr -d v)

if [ "$NODE_MAJOR" -lt "$REQUIRED_NODE_MAJOR" ]; then
  echo "❌ Node.js v18+ required. Please upgrade Node.js."
  exit 1
fi

echo "✅ Node.js version is compatible"

# Initialize npm
npm init -y

# Install dependencies
npm install express dotenv axios

# Prompt for Unsplash API key
read -p "🔑 Enter your Unsplash API Access Key: " UNSPLASH_KEY

# Create .env file
cat > .env <<EOF
UNSPLASH_ACCESS_KEY=${UNSPLASH_KEY}
EOF

# Create index.js
cat > index.js <<EOF
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

app.get("/", (req, res) => {
  res.send("🎨 Welcome to Moodboard! Try /search?query=coffee");
});

app.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).send("Missing query");

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, per_page: 10 },
      headers: { Authorization: \`Client-ID \${ACCESS_KEY}\` },
    });
    const images = response.data.results.map(photo => ({
      description: photo.alt_description,
      url: photo.urls.small,
    }));
    res.json(images);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching from Unsplash");
  }
});

app.listen(PORT, () => {
  console.log(\`🚀 Moodboard app listening on port \${PORT}\`);
});
EOF

# Create Dockerfile
cat > Dockerfile <<EOF
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
EOF

# Create .dockerignore
cat > .dockerignore <<EOF
node_modules
npm-debug.log
.env
EOF

# Create README.md
cat > README.md <<EOF
# 🎨 Moodboard API

This simple Express app fetches mood-based images from Unsplash.

## 🚀 How to Run

### 1. Local

\`\`\`bash
npm install
node index.js
\`\`\`

Go to: [http://localhost:3000/search?query=clouds](http://localhost:3000/search?query=clouds)

### 2. Docker

Build and run:

\`\`\`bash
docker build -t moodboard .
docker run -p 3000:3000 --env-file .env moodboard
\`\`\`

## 🔑 Environment

Create a \`.env\` file:

\`\`\`
UNSPLASH_ACCESS_KEY=your_key_here
\`\`\`

## 📷 Example Output

```json
[
  {
    "description": "sunset over the ocean",
    "url": "https://images.unsplash.com/photo-xxx"
  }
]

