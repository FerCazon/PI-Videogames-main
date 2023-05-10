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
  try {
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
      const genreData = await Genre.findOne({ where: { name: genreName } });
      if (genreData) {
        const [genre, _] = await Genre.findOrCreate({
          ///// uso el operador _ porque el valor es un booleano, porque si es que tiene una coincidencia de genero
          where: { name: genreName },
        });

        console.log("Found or created genre:", genre.toJSON());

        await newGame.addGenre(genre);
      } else {
        console.log(`Genre not found: ${genreName}`);
      }
    }

    const associatedGenres = await newGame.getGenres(); // buscar generos asociados
    console.log(
      "Associated genres:",
      associatedGenres.map((g) => g.toJSON())
    );

    return newGame;
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new Error("A game with this name already exists");
    } else {
      throw err;
    }
  }
};

// aqui es donde me traigo los juegitos de la api o de la base de datos
const getGamesById = async (id, source) => {
  let game;
  console.log(source, id);
  if (source === "api") {
    //esta parte viene de la magia del handler
    const apiResponse = (
      await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
    ).data;
    game = infoclean([apiResponse])[0]; /// yo cuando hago la peticion recibo un objeto, no un array, entonces uso el 0 para indicarle que necesito el indice
    // agrego generos y plataformas al objeto
    game.genres = apiResponse.genres.map((genre) => genre.name);
    game.platforms = apiResponse.platforms.map(
      (platform) => platform.platform.name
    );
  } else {
    game = await Videogame.findByPk(id, {
      include: Genre, // meto generos a la respuesta
    });
    console.log("pepe", game);
    // unifico las propiedades "nombres"
    game = {
      ...game.toJSON(),
      genres: game.genres.map((genre) => genre.name),
      platforms: game.platforms.map(
        (platform) => platform.platform || platform
      ),
    };
  }
  console.log("pepo", game);
  return game;
};

// aqui es donde limpio la info para que me traiga las cosas que yo necesito
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
      created: false, ///// importantisimo
    };
  });
};
// aqui es donde me traigo todos los juegitos de la api
const getAllGames = async (page = 1) => {
  const gamesDB = await Videogame.findAll();

  const infoApi = (
    await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=${page}`)
  ).data;

  const gamesApi = infoclean(infoApi.results);

  return [...gamesDB, ...gamesApi];
};
//aca mergeo los juegos de la api, con los de la base de datos usando axios para api y findall para db
const getGamesByName = async (name) => {
  if (typeof name !== "string") {
    throw new Error("Invalid name parameter");
  }

  const infoApi = (
    await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${name}`
    )
  ).data;

  const gamesApi = infoclean(infoApi.results); // llamo al info para que me de lo que quiero como quiero

  const gameFiltered = gamesApi.filter(
    (games) => games.name.toLowerCase() === name.toLowerCase()
  );

  const gameDb = await Videogame.findAll({ where: { name: name } });

  return [...gameFiltered, ...gameDb];
};

const getPlatformsByGameId = async (gameId) => {
  const response = await axios.get(
    `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`
  );
  const data = response.data;
  return data.platforms;
};

const deleteGameDB = async (id) => {
  try {
    const game = await Videogame.findOne({ where: { id } });
    if (!game) throw new Error("Game not found");

    await game.destroy();

    return { message: `Game with id ${id} deleted` };
  } catch (err) {
    throw err;
  }
};

const updateGameDB = async (id, newData) => {
  /// put || actualizo el juego con New data, me traigo el id y lo actualizo por los parametros. tengo que considerar el genero como siempre
  try {
    const game = await Videogame.findByPk(id);

    if (!game) {
      throw new Error(`Game with id ${id} not found`);
    }

    await game.update(newData);

    // si me traes generos, dale un update
    if (newData.genres && Array.isArray(newData.genres)) {
      // reemplazo los generos removiendolos y poniendolos
      const currentGenres = await game.getGenres();
      await game.removeGenres(currentGenres);

      for (const genreName of newData.genres) {
        const genreData = await Genre.findOne({ where: { name: genreName } });
        if (genreData) {
          await game.addGenre(genreData);
        } else {
          console.log(`Genre not found: ${genreName}`); // lo hacia por el tema de que no encontraba el formato correcto en la base de datos
        }
      }
    }

    // traeme el juego de la base de dato para asociarle el genero
    const updatedGame = await Videogame.findByPk(id, { include: Genre });

    return updatedGame;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createGameDB,
  getGamesById,
  getAllGames,
  getGamesByName,
  getPlatformsByGameId,
  deleteGameDB,
  updateGameDB,
};
