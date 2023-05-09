const { getGenresByGameId, getAllGenres, fetchAndSaveGenres } = require("../controllers/genrecontroller");

const getGenresHandler = async (req, res) => {
  const { gameId } = req.params;
  const { created } = req.query;

  try {
    let response;
    if (created === "true") {
      const game = await db.Videogame.findByPk(gameId, {
        include: db.Genre,
      });
      response = game.Genres;
    } else {
      response = await getGenresByGameId(gameId);
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllGenresHandler = async (req, res) => {
  try {
    const response = await getAllGenres();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const fetchAndSaveGenresHandler = async (req, res) => {
  try {
    await fetchAndSaveGenres();
    res.status(200).json({ message: "Genres fetched and saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getGenresHandler, getAllGenresHandler, fetchAndSaveGenresHandler};