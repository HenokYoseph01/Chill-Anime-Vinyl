import { useState, useEffect } from "react";
import SearchBar from "./components/searchBar";
import SongList from "./components/SongList";
import VinylPlayer from "./components/VinylPlayer";
import SkeletonView from "./components/SkeletonView";
import { fetchAnime } from "./lib/api";
import type { AnimeResponse, SongEntry } from "./lib/api";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [anime, setAnime] = useState<AnimeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongEntry | null>(null);

  //Searching Logic
  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setAnime(null);

    try {
      const data = await fetchAnime(query);
      setAnime(data);
    } catch {
      setError("Anime Not Found. Please Try Another Title.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedSong(null);
  }, [anime]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-6
  bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200
  dark:from-gray-950 dark:via-gray-900 dark:to-gray-800
  text-gray-900 dark:text-white transition-colors duration-300"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl font-bold mb-8 tracking-tight text-center"
      >
        THE CHILL ANIME VINYL
        <ThemeToggle />
      </motion.h1>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full"
      >
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          animeData={anime}
        />
      </motion.h1>
      {loading && (
        <div className="mt-8 flex flex-col items-center gap-8">
          <SkeletonView />
        </div>
      )}
      {error && <p className="mt-6 text-red-400">{error}</p>}

      <AnimatePresence mode="wait">
        {anime && !loading && (
          <motion.div
            key={anime.anime} // triggers animation when new anime loads
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} //Random numbers lol, replicates an ease-out kind of animation
            className="mt-8 w-full flex flex-col items-center gap-10 max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <VinylPlayer
                anime={anime}
                currentSong={selectedSong}
                onSongEnd={() => setSelectedSong(null)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <SongList anime={anime} onSelectSong={setSelectedSong} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
