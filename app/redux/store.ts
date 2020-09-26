import { createStore, applyMiddleware } from "redux";
import {
  START_GAME,
  TAKE_LINE,
  FINISH,
  TOGGLE_PLAYER,
  INITIALIZE_GAME,
  CLEAR_GAME,
} from "./actions";
import getToggledPlayer from "../utils/getToggledPlayer";
import { GameStatus } from "../constants/GameStatus";
import { Player } from "../constants/Player";
import { Pointer } from "../classes/Pointer";
import { GameMap } from "../types";
import { createGameMap } from "../utils";
import { GameSize } from "../constants";

interface State {
  game: {
    status: GameStatus;
    toggledPlayer: boolean;
    player: Player;
    winner: Player;
    gameSize: GameSize;
    map: GameMap;
  };
}

const initialState: State = {
  game: {
    status: GameStatus.Ready,
    toggledPlayer: true,
    player: null,
    winner: null,
    gameSize: null,
    map: {
      seed: null,
      cells: null,
      gates: null,
      borders: null,
      pointer: null,
      width: null,
      height: null,
    },
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_GAME:
      return {
        ...state,
        game: {
          ...initialState.game,
          status: GameStatus.Initialized,
          player: Player.A,
          map: createGameMap(action.payload.seed),
          gameSize: action.payload.gameSize,
          seed: action.payload.seed,
        },
      };

    case START_GAME:
      return {
        ...state,
        game: {
          ...state.game,
          status: GameStatus.Playing,
        },
      };

    case TAKE_LINE:
      const cells = [...state.game.map.cells];
      cells[action.payload.y][action.payload.x].takeLine(
        action.payload.direction,
        state.game.player,
        action.payload.backwards
      );
      const { x, y } = state.game.map.pointer.getNextCoordinates(
        action.payload.y,
        action.payload.x,
        action.payload.direction
      );
      return {
        ...state,
        game: {
          ...state.game,
          toggledPlayer: false,
          map: {
            ...state.game.map,
            cells,
            pointer: new Pointer(x, y),
          },
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

    case CLEAR_GAME:
      return {
        ...state,
        game: { ...initialState.game },
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
