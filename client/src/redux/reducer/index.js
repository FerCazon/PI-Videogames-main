import { GET_GAMES, GET_BY_NAME, GET_GENRES } from "../actions"
let initialState = {allGames: [], allgamesCopy: [], genres:[]}
// este es el reducer que me va a inicializar el state
function rootReducer(state = initialState, action) {
    switch(action.type) {

        case GET_GAMES:
            return{
                ...state,
                allGames: action.payload,
                allgamesCopy: action.payload
            }
        case GET_BY_NAME:
            return{
                ...state,
                allGames: action.payload,
                
            }
            case GET_GENRES:
      return {
        ...state,
        genres: action.payload,
      };
        default:
            return state
    }

}

export default rootReducer