# 🎵 The Chill Anime Vinyl

A sleek full-stack web application that lets you explore anime openings (OPs) and endings (EDs) in a **vinyl-inspired music player**.  
Built with **React + TypeScript + Vite** on the frontend and **Node.js + Express + Axios** on the backend... and tears

---

## ✨ Features

### 🎧 Anime Vinyl Player

- Plays anime openings (OPs) and endings (EDs)
- Animated vinyl record that spins when playing
- Play/Pause functionality via vinyl click
- “Now Playing” and “Loading Audio” indicators
- Auto-reset when a song finishes

### 🔍 Smart Search

- Manual anime search via search button
- Real-time search suggestions with debounce
- Click on suggestion to instantly load anime
- Loader displayed during searches

### 🌗 Light/Dark/System Theme

- Fully responsive Tailwind dark mode
- System theme detection and persistence via `localStorage`

### ⚡ Optimized Performance

- Debounced real-time API requests
- Audio playback cleanup when switching anime
- Smooth framer-motion animations

---

## 🧱 Project Structure

```bash
project-root/
├── backend/
│ ├── src/
│ │ ├── server.js
│ │ ├── app.js
│ │ ├── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── SearchBar.tsx # Search input with real-time suggestions
│ │ │ ├── SongList.tsx # Displays OPs and EDs
│ │ │ ├── VinylPlayer.tsx # The music player with vinyl animation
│ │ │ ├── SkeletonView.tsx # Loading skeleton while fetching anime
│ │ │ └── ui/ # Reusable UI components (Button, Input, etc.)
│ │ ├── lib/
│ │ │ └── api.ts # Axios API wrapper (fetchAnime, fetchAnimeSuggestions)
│ │ ├── App.tsx # Main app logic and layout
│ │ ├── main.tsx # React entry file
│ │ └── index.css # Tailwind + dark mode setup
│ ├── .env.example
│ ├── vite.config.ts # Vite + TailwindCSS configuration
│ ├── tsconfig.json
│ ├── tsconfig.app.json
│ ├── tsconfig.node.json
│ └── package.json
│
├── README.md
└── .gitignore
```

## ⚙️ Backend Setup

### 🧩 Tech Stack

- **Node.js + Express**
- **Axios** for external requests

### 📦 Installation

```bash
cd backend
npm install
npm run dev
```

Backend Should start on:

```
http://localhost:5000
```

## 💻 Frontend Setup

### 🧩 Tech Stack

- **React + TypeScript + Vite**
- **TailwindCSS (via @tailwindcss/vite)**
- **Framer Motion for animation**
- **Axios for API calls**

### 📦 Installation

```bash
cd frontend
npm install
```

🔑 Environment Variables

```bash
VITE_API_URL=http://localhost:5000
```

🔑 Run The App

```bash
npm run dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## 🩵 Author

Henok Yoseph

Built with ❤️ using React, TypeScript, Express, and TailwindCSS, Node Js, Express, and lots of coffee and sanity.

## License

MIT License — free to use and modify.
