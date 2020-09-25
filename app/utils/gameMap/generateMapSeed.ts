import random from "random-int";
import { cond, isEqual, always } from "lodash/fp";
import { GameSize } from "../../constants";
import { MapSeed } from "../../types";

const getGameSizeBase = cond([
  [isEqual(GameSize.SMALL), () => random(3, 4)],
  [isEqual(GameSize.MEDIUM), () => random(5, 6)],
  [isEqual(GameSize.LARGE), () => random(7, 8)],
]);

export default function (gameSize: GameSize): MapSeed {
  const width = 10; //getGameSizeBase(gameSize) * 2;
  const height = 10; //getGameSizeBase(gameSize) * 2;

  const gates = {
    A: [
      {
        from: {
          x: width / 2 - 1,
          y: 0,
        },
        to: {
          x: width / 2 + 1,
          y: 0,
        },
      },
    ],
    B: [
      {
        from: {
          x: width / 2 - 1,
          y: height,
        },
        to: {
          x: width / 2 + 1,
          y: height,
        },
      },
    ],
  };

  const pointer = {
    x: width / 2,
    y: height / 2,
  };

  return {
    width,
    height,
    gates,
    pointer,
  };
}
