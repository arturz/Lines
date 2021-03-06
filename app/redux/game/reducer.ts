import { Reducer } from "redux";
import { GameState } from "./types";
import { GameStatus, Player } from "../../constants";
import {
  INITIALIZE_GAME,
  START_GAME,
  TAKE_LINE,
  TOGGLE_PLAYER,
  FINISH,
  CLEAR_GAME,
  INITIALIZE_AND_START_GAME,
} from "./actions";
import { createGameMap, getToggledPlayer } from "../../utils";
import { Pointer } from "../../classes";

const initialState: GameState = {
  status: GameStatus.Ready,
  toggledPlayer: true,
  player: null,
  winner: null,
  gameSize: null,
  map: {
    seed: null,
    cells: null,
    lastTakenLine: null,
    gates: null,
    borders: null,
    pointer: null,
    powerUps: [],
    width: null,
    height: null,
  },
};

export const gameReducer: Reducer<GameState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case INITIALIZE_GAME:
    case INITIALIZE_AND_START_GAME:
      return {
        ...state,
        ...initialState,
        status: GameStatus.Initialized,
        player: Player.A,
        map: createGameMap(action.payload.seed),
        gameSize: action.payload.gameSize,
        seed: action.payload.seed,
        ...(action.type === INITIALIZE_AND_START_GAME && {
          status: GameStatus.Playing,
        }),
      };

    case START_GAME:
      return {
        ...state,
        status: GameStatus.Playing,
      };

    case TAKE_LINE:
      const cells = [...state.map.cells];
      cells[action.payload.y][action.payload.x].takeLine(
        action.payload.direction,
        state.player,
        action.payload.backwards
      );
      const { x, y } = state.map.pointer.getNextCoordinates(
        action.payload.y,
        action.payload.x,
        action.payload.direction
      );
      return {
        ...state,
        toggledPlayer: false,
        map: {
          ...state.map,
          cells,
          lastTakenLine: {
            x: action.payload.x,
            y: action.payload.y,
            direction: action.payload.direction,
            backwards: action.payload.backwards,
            player: state.player
          },
          pointer: new Pointer(x, y),
        },
      };

    case TOGGLE_PLAYER:
      return {
        ...state,
        ...state,
        toggledPlayer: true,
        player: getToggledPlayer(state.player),
      };

    case FINISH:
      return {
        ...state,
        status: GameStatus.Finish,
        winner: action.payload.winner,
      };

    case CLEAR_GAME:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
};
