import axios from "axios";

export const GET_GAMES = "GET_GAMES";
export const GET_BY_NAME = "GET_BY_NAME";
export const GET_GENRES = 'GET_GENRES';

// aca va la action que me va a traer los juegos desde el servidor
export function getGames(page = 1) {
  return async function (dispatch) {
    const response = await axios.get(
      `http://localhost:3001/games?page=${page}`
    );
    console.log("getGames games:", response.data)
    return dispatch({
      type: "GET_GAMES",
      payload: response.data,
    });
  };
}

export function getByName(name) {
  return async function (dispatch) {
    const response = await axios.get(
      `http://localhost:3001/games/?name=${name}`
    );
    console.log("getByName games:", response.data)
    return dispatch({
      type: "GET_BY_NAME",
      payload: response.data,
    });
  };
}
export function getGenres() {
  return async function (dispatch) {
    const response = await fetch(`http://localhost:3001/genres`);
    const data = await response.json();
    dispatch({ type: GET_GENRES, payload: data });
  };
}
