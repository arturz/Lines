import { GameStatus, Player, GameSize } from "../../constants";
import { GameMap } from "../../types";

export type GameState = {
  readonly status: GameStatus;
  readonly toggledPlayer: boolean;
  readonly player: Player;
  readonly winner: Player;
  readonly gameSize: GameSize;
  readonly map: GameMap;
};
