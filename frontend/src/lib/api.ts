import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export interface SongEntry {
  type: string;
  title: string;
  videos?: { url?: string }[];
}

export interface AnimeResponse {
  anime: string;
  image: string;
  openings: SongEntry[];
  endings: SongEntry[];
}

export interface AnimeSuggestion {
  mal_id: number;
  name: string;
  image: string;
  year: number;
}

export async function fetchAnime(query: string): Promise<AnimeResponse> {
  const { data } = await axios.get(`${API}/anime/${query}`);
  return data;
}

export async function fetchAnimeSuggestions(
  query: string
): Promise<AnimeSuggestion[]> {
  if (!query.trim()) return [];
  const { data } = await axios.get(`${API}/search`, {
    params: { q: query },
  });
  return data || [];
}
