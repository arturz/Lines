import { Player, Direction } from "../../constants";

export const INITIALIZE_GAME = "INITIALIZE_GAME" as const;
export function initializeGame(width: number, height: number) {
  return {
    type: INITIALIZE_GAME,
    payload: { width, height },
  };
}

export const START_GAME = "START_GAME" as const;
export function startGame() {
  return {
    type: START_GAME,
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
