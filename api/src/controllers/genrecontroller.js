require("dotenv").config();
const db = require("../db");
const axios = require("axios");
const { API_KEY } = process.env;
const Genre = db.Genre;

const getGenresByGameId = async (gameId) => {
  /// me traigo los generos por id
  const response = await axios.get(
    `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`
  );
  const data = response.data;
  return data.genres;
};
const getAllGenres = async () => {
  const response = await axios.get(
    `https://api.rawg.io/api/genres?key=${API_KEY}`
  );
  const data = response.data;
  return data.results;
};

const fetchAndSaveGenres = async () => {
  /// populando la base de datos de genres
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/genres?key=${API_KEY}`
    );
    const genres = response.data.results;

    for (const genre of genres) {
      const existingGenre = await Genre.findOne({ where: { id: genre.id } });

      if (!existingGenre) {
        await Genre.create({
          id: genre.id,
          name: genre.name,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching and saving genres:", error);
  }
};

module.exports = { getGenresByGameId, getAllGenres, fetchAndSaveGenres };
