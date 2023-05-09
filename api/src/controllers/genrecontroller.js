require("dotenv").config();
const db = require("../db");
const axios = require("axios");
const { API_KEY } = process.env;
const Genre = db.Genre;

const getGenresByGameId = async (gameId) => {
    const response = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
    const data = response.data;
    return data.genres;
  };
  const getAllGenres = async () => {
    const response = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
    const data = response.data;
    return data.results;
  };

  const fetchAndSaveGenres = async () => {
    try {
      const response = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`); 
      const genres = response.data.results; // Assign the 'results' array to the genres variable
    
      for (const genre of genres) {
        // Check if the genre exists in the database
        const existingGenre = await Genre.findOne({ where: { id: genre.id } });
    
        if (!existingGenre) {
          // If the genre doesn't exist, create and save it
          await Genre.create({
            id: genre.id,
            name: genre.name,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching and saving genres:', error);
    }
  };
  
  module.exports = { getGenresByGameId, getAllGenres, fetchAndSaveGenres };