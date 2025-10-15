import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { fetchAnimeSuggestions } from "@/lib/api";
import type { AnimeResponse, AnimeSuggestion } from "@/lib/api";

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  animeData: AnimeResponse | null;
}

const SearchBar = ({ onSearch, loading, animeData }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AnimeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(true);

  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!query.trim() || animeData || loading) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      setIsFetchingSuggestions(true);
      try {
        const data = await fetchAnimeSuggestions(query);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 400); // 400ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, animeData, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (anime: AnimeSuggestion) => {
    setQuery(anime.name);
    setShowSuggestions(false);
    onSearch(anime.name);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={loading}
          className="hover:cursor-pointer hover:bg-gray-700"
        >
          {loading ? "Searching" : "Search"}
        </Button>
      </form>

      {/* Suggestion Dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {isFetchingSuggestions ? (
            // 🌀 Loader
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mr-2"></div>
              <span className="text-gray-400 text-sm">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            // ✅ Suggestions list
            <ul>
              {suggestions.map((anime) => (
                <li
                  key={anime.mal_id}
                  onClick={() => handleSelectSuggestion(anime)}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-700"
                >
                  <img
                    src={anime.image}
                    alt={anime.name}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">
                      {anime.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {anime.year || "Unknown Year"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            // ❌ No results
            !isFetchingSuggestions && (
              <div className="text-center py-3 text-gray-500 text-sm">
                No results found
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
