# Moodify

A React application that analyzes Spotify playlist audio features and generates animated mood visualizations.

## How it works

Moodify fetches audio feature data from the Spotify API - energy, valence, danceability, acousticness, tempo - and runs them through a color-mapping algorithm that converts those multidimensional values into smooth gradient transitions. The gradient and mood label update in real time as tracks are toggled.

## Features

- Spotify OAuth authentication and playlist loading
- Real-time audio feature analysis across selected tracks
- Color-mapping algorithm: valence → hue, energy → saturation, danceability → gradient spread
- Animated gradient visualization that reflects playlist mood
- Mood classification (Euphoric, Serene, Tense, Melancholic, Pensive)

## Tech

- React + Vite
- Spotify Web API (audio features, playlists)
- PKCE OAuth flow

## Setup

```bash
npm install
npm run dev
```

Add your Spotify Client ID to a `.env` file:

```
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
```

