import { createStore, applyMiddleware } from "redux";
import { Color } from "./classes/Color";
import { GameMap } from "./classes/GameMap";
import { START_GAME, TAKE_LINE, FINISH, CHANGE_COLOR } from "./actions/game";
import { Status } from "./classes/Status";
import reverseColor from "./utils/reverseColor";

const initialState = {
  changedColor: true,
  status: Status.Playing,
  color: Color.Red,
  winner: null,
  map: null,
};

function reducer(state, action) {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        winner: null,
        status: Status.Playing,
        color: Color.Red,
        map: new GameMap(action.payload.width, action.payload.height),
      };
    case TAKE_LINE:
      const map = state.map.copy();
      map.cells[action.payload.y][action.payload.x].takeLine(
        action.payload.direction,
        state.color
      );
      map.pointer.updateCoordinates(
        action.payload.y,
        action.payload.x,
        action.payload.direction
      );
      return {
        ...state,
        changedColor: false,
        map,
      };
    case CHANGE_COLOR:
      return {
        ...state,
        changedColor: true,
        color: reverseColor(state.color),
      };
    case FINISH:
      return {
        ...state,
        status: Status.Finish,
        winner: action.payload.winner,
      };
    default:
      return state;
  }
}

const logger = (store) => (next) => (action) => {
  console.log(action.type, action.payload);
  return next(action);
};

export const store = createStore(
  reducer,
  initialState,
  applyMiddleware(logger)
);
