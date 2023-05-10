import axios from "axios";

export const GET_GAMES = "GET_GAMES";
export const GET_BY_NAME = "GET_BY_NAME";
export const GET_GENRES = 'GET_GENRES';
export const DELETE_GAME = "DELETE_GAME";

// aca va la action que me va a traer los juegos desde el servidor
export function getGames(page = 1,force = false) {
  return async function (dispatch, getState) {
    if (!force && getState().allGames.length > 0) {
      return; // saltea el fetch si force no es true y si hay cosas cacheadas
    }
    const response = await axios.get(
      `http://localhost:3001/games?page=${page}`
    );
    const gamesWithGenres = await Promise.all(
      response.data.map(async (game) => {
        if (!game.genres) {
          const genreResponse = await axios.get(
            `http://localhost:3001/games/${game.id || game.gameId}`
          );
          return { ...game, genres: genreResponse.data.genres };
        }
        return game;
      })
    );

    console.log("getGames games:", gamesWithGenres);
    return dispatch({
      type: "GET_GAMES",
      payload: gamesWithGenres,
    });
  };
}

export function getByName(name) {
  return async function (dispatch) {
    const response = await axios.get(
      `http://localhost:3001/games/?name=${name}`
    );
    const gamesWithGenres = await Promise.all(
      response.data.map(async (game) => {
        if (!game.genres) {
          const genreResponse = await axios.get(
            `http://localhost:3001/games/${game.id || game.gameId}`
          );
          return { ...game, genres: genreResponse.data.genres };
        }
        return game;
      })
    );

    console.log("getByName games:", gamesWithGenres);
    return dispatch({
      type: "GET_BY_NAME",
      payload: gamesWithGenres,
    });
  };
}

export function getGenres(force = false) {
  return async function (dispatch, getState) {
    if(!force && getState().genres.length >0){
      return
    }
    const response = await fetch(`http://localhost:3001/genres`);
    const data = await response.json();
    dispatch({ type: GET_GENRES, payload: data });
  };
}

export function deleteGame(id) {
  return async function(dispatch) {
    await axios.delete(`http://localhost:3001/games/${id}`);
    dispatch({ type: 'DELETE_GAME', payload: id });
  };
}


