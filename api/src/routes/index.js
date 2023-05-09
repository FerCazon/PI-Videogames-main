const { Router } = require("express");
const {getDetailHandler, getGamesHandler, createGameHandler, getPlatformsHandler} = require("../handlers/gameshandlers")
const { getGenresHandler, getAllGenresHandler, fetchAndSaveGenresHandler } = require("../handlers/genrehandler")
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/games", getGamesHandler);

router.get("/games/:id", getDetailHandler);

router.post("/create", createGameHandler);

router.get("/genres/:gameId", getGenresHandler)

router.get("/platforms/:gameId", getPlatformsHandler);

router.get("/genres",getAllGenresHandler );

router.get("/fetchandsave", fetchAndSaveGenresHandler);

module.exports = router;