import { createStore, applyMiddleware } from "redux";
import { GameMap } from "../classes/GameMap";
import { START_GAME, TAKE_LINE, FINISH, TOGGLE_PLAYER } from "./actions";
import getToggledPlayer from "../utils/getToggledPlayer";
import { GameStatus } from "../constants/GameStatus";
import { Player } from "../constants/Player";
import { Pointer } from "../classes/Pointer";
import { Gates } from "../classes/Gates";

interface State {
  game: {
    status: GameStatus;
    toggledPlayer: boolean;
    player: Player;
    pointer: Pointer;
    winner: Player;
    map: GameMap;
    gates: Gates;
  };
}

const initialState: State = {
  game: {
    status: GameStatus.Ready,
    toggledPlayer: true,
    player: null,
    pointer: null,
    winner: null,
    map: null,
    gates: null,
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        game: {
          ...initialState.game,
          status: GameStatus.Playing,
          player: Player.A,
          pointer: new Pointer(
            action.payload.width / 2,
            action.payload.height / 2
          ),
          map: new GameMap(action.payload.width, action.payload.height),
          gates: new Gates(action.payload.width, action.payload.height),
        },
      };

    case TAKE_LINE:
      const map = new GameMap(
        state.game.map.width,
        state.game.map.height,
        state.game.map
      );
      map.cells[action.payload.y][action.payload.x].takeLine(
        action.payload.direction,
        state.game.player,
        action.payload.backwards
      );
      const { x, y } = state.game.pointer.getNextCoordinates(
        action.payload.y,
        action.payload.x,
        action.payload.direction
      );
      return {
        ...state,
        game: {
          ...state.game,
          toggledPlayer: false,
          map,
          pointer: new Pointer(x, y),
        },
      };

    case TOGGLE_PLAYER:
      return {
        ...state,
        game: {
          ...state.game,
          toggledPlayer: true,
          player: getToggledPlayer(state.game.player),
        },
      };

    case FINISH:
      return {
        ...state,
        game: {
          ...state.game,
          status: GameStatus.Finish,
          winner: action.payload.winner,
        },
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
