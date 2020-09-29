import { Player } from "../../../constants";

export default (
  player: Player,
  fromY: number,
  toY: number,
  fromX: number,
  toX: number
) => ({
  player,
  from: {
    x: fromX,
    y: fromY,
  },
  to: {
    x: toX,
    y: toY,
  },
});
