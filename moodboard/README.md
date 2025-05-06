# 🎨 Mood Board Generator

A simple Dockerized Node.js app that fetches images from Unsplash based on a mood keyword.

## 🚀 Run Locally

```bash
docker build -t moodboard-app .
docker run -p 3000:3000 --env-file .env moodboard-app
