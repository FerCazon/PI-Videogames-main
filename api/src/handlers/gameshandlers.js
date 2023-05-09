const { createGameDB, getGamesById, getAllGames, getGamesByName, getPlatformsByGameId } = require("../controllers/videogames");

const getGamesHandler = async (req, res) => {
  const { name, page, sortBy, order, origin } = req.query;

  try {
    let games;
    if (name) {
      if (typeof name !== "string") {
        res.status(400).json({ error: "Invalid name parameter" });
      } else {
        games = await getGamesByName(name);
      }
    } else {
      const pageNumber = parseInt(page, 10) || 1; // paginado
      games = await getAllGames(pageNumber);
    }

    // origen
    if (origin) {
      games = games.filter((game) => {
        if (origin === "API") {
          return !game.created;
        } else if (origin === "DB") {
          return game.created;
        }
      });
    }

    // Sort de rating
    if (sortBy === "rating" && (order === "ASC" || order === "DESC")) {
      games = sortGamesByRating(games, order);
    } else if (sortBy === "alphabetical" && (order === "ASC" || order === "DESC")) {
      games.sort((a, b) => {
        if (order === "ASC") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    }

    res.status(200).json(games);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getDetailHandler = async (req, res) => {
  const { id } = req.params;
  const source = isNaN(id) ? "bdd" : "api";
console.log(id,source);
  try {
    const response = await getGamesById(id, source);

    // darle a las plataformas el formato de array
    if (response.platforms && Array.isArray(response.platforms)) {
      response.platforms = response.platforms.map(
        (platform) => platform.platform || platform
      );
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createGameHandler = async (req, res) => {
  const {name, description, platforms, image, releaseDate, rating, genres} = req.body;
  try {
    const newGame = await createGameDB(name, description, platforms, image, releaseDate, rating, genres);
    const associatedGenres = await newGame.getGenres(); // Fetch associated genres
    const response = newGame.toJSON(); // Convert instance to plain object
    response.genres = associatedGenres; // Add genres to the response object
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const getPlatformsHandler = async (req, res) => {
  const { gameId } = req.params;

  try {
    const response = await getPlatformsByGameId(gameId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {getDetailHandler,getGamesHandler, createGameHandler, getPlatformsHandler }