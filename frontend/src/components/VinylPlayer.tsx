import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AnimeResponse, SongEntry } from "@/lib/api";

interface VinylPlayerProps {
  anime: AnimeResponse;
  currentSong: SongEntry | null;
  onSongEnd?: () => void;
}

const VinylPlayer = ({ anime, currentSong, onSongEnd }: VinylPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  // const [progress, setProgress] = useState(0); //Between 0-1 for tracking length of a song playing
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.videos?.[0]?.url) return;

    setIsPlaying(false);
    setIsLoadingAudio(true);
    audio.src = currentSong.videos[0].url;

    const handleReady = () => {
      setTimeout(() => {
        audio.play().then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        });
      }, 5000); // wait 5 seconds before starting
    };

    const handleError = () => {
      setIsLoadingAudio(false);
      console.error("Audio failed to load");
    };

    // const handleTimeUpdate = () => {
    //   if (audio.duration > 0) {
    //     setProgress(audio.currentTime / audio.duration);
    //   }
    // };

    //For the sake of showing when the song is loading during playback (as webm is being rendered to audio)
    const handleWaiting = () => setIsLoadingAudio(true);
    const handlePlaying = () => setIsLoadingAudio(false);

    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    //Event listners to make sure the audio is buffered decently enough for seemless audio
    audio.addEventListener("canplaythrough", handleReady);
    audio.addEventListener("error", handleError);
    //Stop music viynl spinning when song ends
    const handleEnd = () => {
      setIsPlaying(false);
      setIsLoadingAudio(false);

      if (audioRef.current) {
        audioRef.current.src = ""; // stop any lingering buffer
      }

      // Inform parent to reset currentSong
      if (onSongEnd) onSongEnd();
    };
    audio.addEventListener("ended", handleEnd);
    // audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setIsLoadingAudio(false);
      }
      audio.removeEventListener("canplaythrough", handleReady);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnd);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      // audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentSong, audioRef]);

  const handlePlayPause = () => {
    if (!audioRef.current || isLoadingAudio) return; // Prevent clicks while loading

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Only play if the song isn't already ended
      if (audioRef.current.currentTime >= audioRef.current.duration) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* 🎚️ Needle Arm */}
      <motion.div
        initial={{ rotate: -45, x: -30, y: -30 }}
        animate={
          isPlaying
            ? { rotate: -15, x: -5, y: -5 }
            : { rotate: -45, x: -30, y: -30 }
        }
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="absolute top-4 right-10 w-1 h-32 origin-top bg-gradient-to-b from-gray-400 to-gray-600 rounded-full shadow-md z-10"
      >
        {/* Arm head (stylus) */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-sm"
          animate={{
            backgroundColor: isPlaying ? "#60a5fa" : "#d1d5db",
            boxShadow: isPlaying ? "0 0 6px #60a5fa" : "none",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* 💿 Vinyl Disc */}
      <motion.div
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          repeat: isPlaying ? Infinity : 0,
          duration: 5,
          ease: "linear",
        }}
        onClick={handlePlayPause}
        className="w-64 h-64 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-xl flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {/* <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="#60a5fa"
            strokeWidth="1.5"
            fill="transparent"
            strokeDasharray="301.6"
            strokeDashoffset={301.6 - progress * 301.6}
            className="transition-all duration-300 ease-linear"
          />
        </svg> */}
        <img
          src={anime.image}
          alt={`${anime.anime} cover`}
          className="w-30 h-30 rounded-full object-cover"
        />
      </motion.div>

      <audio ref={audioRef} preload="auto" />

      {currentSong ? (
        <div className="text-center mt-2">
          {isLoadingAudio ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Loading audio...
            </p>
          ) : (
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
              🎵 Now Playing: {currentSong.title}
            </p>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400">
            ({currentSong.type})
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a song to play
        </p>
      )}
    </div>
  );
};

export default VinylPlayer;
