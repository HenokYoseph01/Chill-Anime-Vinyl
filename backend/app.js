import express from "express";
import cors from "cors";
import axios from "axios";

//Initalize express app
const app = express();
//Set up cors
app.use(cors());

app.get("/anime/:name", async (req, res) => {
  const animeName = req.params.name.toLocaleLowerCase().replace(/\s+/g, "_"); //replace any spaces with _
  const directUrl = `https://api.animethemes.moe/anime/${animeName}?include=animethemes.song,animethemes.animethemeentries.videos`;
  try {
    let data;
    try {
      const response = await axios.get(directUrl);
      data = response.data;
    } catch {
      //Catch has more logic as sometimes titles can be in their anglo-japanese form (e.g attack on titan -> Shingeki no Kyojin)
      try {
        const jikanSearchUrl = `https://api.jikan.moe/v4/anime?q=${req.params.name}&limit=1`;
        const jikanSearchRes = await axios.get(jikanSearchUrl);
        console.log(jikanSearchRes);
        const japaneseTitle = jikanSearchRes.data?.data?.[0]?.title;

        if (!japaneseTitle) {
          return res.status(404).json({ error: "Anime Not Found" });
        }

        const fallbackSlug = japaneseTitle
          .toLocaleLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[!?.:'"()]/g, "");

        const slugUrl = `https://api.animethemes.moe/anime/${fallbackSlug}?include=animethemes.song,animethemes.animethemeentries.videos`;

        const animeRes = await axios.get(slugUrl);
        data = animeRes.data;
      } catch (fallbackErr) {
        console.error("Fallback failed:", fallbackErr.message);
        return res.status(404).json({ error: "Anime Not Found" });
      }
    }

    const anime = data.anime;
    const theme = anime.animethemes.map((theme) => {
      // flatten all videos
      const allVideos =
        theme.animethemeentries?.flatMap(
          (entry) =>
            entry.videos?.map((video) => ({
              url: video.link,
              resolution: video.resolution,
            })) ?? []
        ) ?? [];

      // filter for <=720p
      let filteredVideos = allVideos.filter(
        (v) => v.resolution && v.resolution <= 720
      );

      // fallback if empty
      if (filteredVideos.length === 0) {
        filteredVideos = allVideos.sort((a, b) => a.resolution - b.resolution);
      }

      return {
        type: theme.type,
        title: theme.song?.title?.replace(/\s*\(.*?\)\s*/g, "").trim(),
        videos: filteredVideos,
      };
    });

    //Fetch the cover image via Jikan API
    let imageUrl = null;
    try {
      const jikanUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
        req.params.name
      )}&limit=1`;
      const jikanRes = await axios.get(jikanUrl);
      imageUrl = jikanRes.data?.data?.[0]?.images?.jpg?.large_image_url || null;
    } catch (err) {
      console.warn("Could not fetch image from Jikan:", err.message);
    }

    res.json({
      anime: anime.name,
      image: imageUrl,
      openings: theme.filter((t) => t.type === "OP"),
      endings: theme.filter((t) => t.type === "ED"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Anime not found or API error.");
  }
});

//Search
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing Query Parameter" });

  try {
    const jikanApi = `https://api.jikan.moe/v4/anime?q=${query}&limit=10`;
    const response = await axios.get(jikanApi);
    const result =
      response.data?.data?.map((anime) => ({
        name: anime.title,
        mal_id: anime.mal_id,
        image: anime.images?.webp?.image_url,
        year: anime.year,
      })) || [];

    res.json(result);
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(3000, () => console.log("Server Running on Port 3000"));

export default app;
