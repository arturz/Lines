import { Player, Direction, GameSize } from "../../constants";
import { MapSeed } from "../../types";

export const INITIALIZE_GAME = "INITIALIZE_GAME" as const;
export function initializeGame(seed: MapSeed, gameSize: GameSize) {
  return {
    type: INITIALIZE_GAME,
    payload: { seed, gameSize },
  };
}

export const START_GAME = "START_GAME" as const;
export function startGame() {
  return {
    type: START_GAME,
  };
}

export const INITIALIZE_AND_START_GAME = "INITIALIZE_AND_START_GAME" as const;
export function initializeAndStartGame(seed: MapSeed, gameSize: GameSize) {
  return {
    type: INITIALIZE_AND_START_GAME,
    payload: { seed, gameSize },
  };
}

export const FINISH = "FINISH" as const;
export function finish(winner: Player) {
  return { type: FINISH, payload: { winner } };
}

export const TAKE_LINE = "TAKE_LINE" as const;
export function takeLine(
  y: number,
  x: number,
  direction: Direction,
  backwards = false
) {
  return { type: TAKE_LINE, payload: { x, y, direction, backwards } };
}

export const TOGGLE_PLAYER = "TOGGLE_PLAYER" as const;
export function togglePlayer() {
  return { type: TOGGLE_PLAYER };
}

export const PAUSE_GAME = "PAUSE_GAME" as const;
export function pauseGame() {
  return { type: PAUSE_GAME };
}

export const CLEAR_GAME = "CLEAR_GAME" as const;
export function clearGame() {
  return { type: CLEAR_GAME };
}
