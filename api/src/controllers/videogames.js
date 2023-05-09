require("dotenv").config();
const db = require("../db");
const { API_KEY } = process.env;
const Videogame = db.Videogame;
const Genre = db.Genre;
const axios = require("axios");
// aqui es donde creo el juego en la base de datos
const createGameDB = async (
  name,
  description,
  platforms,
  image,
  releaseDate,
  rating,
  genres
) => {
  const newGame = await Videogame.create({
    name,
    description,
    platforms,
    image,
    releaseDate,
    rating,
  });

  console.log("New game created:", newGame.toJSON()); // Ver el juego que se creo

  // Encontrar o crear generos y asociarlos
  for (const genreName of genres) {
    // Fetch genre by its name
    const genreData = await Genre.findOne({ where: { name: genreName } });

    if (genreData) {
      // If the genre exists, find or create it by its name
      const [genre, _] = await Genre.findOrCreate({
        where: { name: genreName },
      });

      console.log("Found or created genre:", genre.toJSON());

      await newGame.addGenre(genre);
    } else {
      console.log(`Genre not found: ${genreName}`);
    }
  }

  const associatedGenres = await newGame.getGenres(); // buscar generos asociados
  console.log("Associated genres:", associatedGenres.map(g => g.toJSON())); 

  return newGame;
};

// aqui es donde me traigo los juegitos de la api
const getGamesById = async (id, source) => {
  let game;
  console.log(source, id)
  if (source === "api") {
    const apiResponse = (await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)).data;
    game = infoclean([apiResponse])[0];
   // agrego generos y plataformas al objeto
    game.genres = apiResponse.genres.map((genre) => genre.name);
    game.platforms = apiResponse.platforms.map((platform) => platform.platform.name);
  } else {
    game = await Videogame.findByPk(id, {
      include: Genre // meto generos a la respuesta
    });
    console.log("pepe",game)
    // unifico las propiedades "nombres"
    game = {
      ...game.toJSON(),
      genres: game.genres.map((genre) => genre.name),
       platforms: game.platforms.map((platform) => platform.platform || platform)
    };
  }
  console.log("pepo",game)
  return game;
};


// aqui es donde reseteo la info despues de traerme las cosas
const infoclean = (array) => {
  return array.map((element) => {
    return {
      gameId: element.id,
      name: element.name,
      description: element.description,
      platforms: element.platforms.map((platform) => platform.platform.name),
      image: element.background_image,
      released: element.released,
      rating: element.rating,
      created: false
    }
  })
}
// aqui es donde me traigo todos los juegitos de la api
const getAllGames = async (page = 1) => {
  const gamesDB = await Videogame.findAll();

  const infoApi = (
    await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}`
    )
  ).data;

  const gamesApi = infoclean(infoApi.results);

  return [...gamesDB, ...gamesApi];
};
//aca mergeo los juegos de la api, con los de la base de datos usando axios para api y findall para db
const getGamesByName = async (name) => {
  if (typeof name !== 'string') {
    throw new Error("Invalid name parameter");
  }

  const infoApi = (await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&search=${name}`)).data;

  const gamesApi = infoclean(infoApi.results);

  const gameFiltered = gamesApi.filter(games => games.name.toLowerCase() === name.toLowerCase());

  const gameDb = await Videogame.findAll({ where: { name: name } });

  return [...gameFiltered, ...gameDb];
};

const getPlatformsByGameId = async (gameId) => {
  const response = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
  const data = response.data;
  return data.platforms;
};

module.exports = { createGameDB, getGamesById, getAllGames, getGamesByName, getPlatformsByGameId };