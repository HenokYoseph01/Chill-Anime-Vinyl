import type { AnimeResponse, SongEntry } from "@/lib/api";
import { Card, CardContent } from "./ui/card";

interface SongListProps {
  anime: AnimeResponse;
  onSelectSong: (song: SongEntry) => void;
}

const SongList = ({ anime, onSelectSong }: SongListProps) => {
  const allSongs = [...anime.openings, ...anime.endings];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
      {allSongs.map((song, idx) => (
        <Card
          key={idx}
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => onSelectSong(song)}
        >
          <CardContent className="p-4">
            <p className="text-lg font-medium">{song.title}</p>
            <p className="text-sm text-gray-400">{song.type}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SongList;
