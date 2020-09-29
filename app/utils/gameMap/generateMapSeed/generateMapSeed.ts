import random from "random-int";
import { cond, isEqual, always } from "lodash/fp";
import { GameSize, MatrixPosition, Player } from "../../../constants";
import { MapSeed } from "../../../types";
import getGate from "./getGate";
import getRelativeSubstraction from "./getRelativeSubstraction";

const getGameSizeBase = cond([
  [isEqual(GameSize.SMALL), always(8)],
  [isEqual(GameSize.MEDIUM), always(12)],
  [isEqual(GameSize.LARGE), always(16)],
]);

const chance = (percentage: number) => {
  return random(1, 100) <= percentage;
};

export default function (gameSize: GameSize): MapSeed {
  let width;
  let height;

  const gameSizeBase = getGameSizeBase(gameSize);

  const isRectangle = chance(50);
  if (isRectangle) {
    width = gameSizeBase;
    height = gameSizeBase;
  } else {
    width = gameSizeBase - Math.floor(gameSizeBase / 8) * 2;
    height = gameSizeBase + Math.floor(gameSizeBase / 8) * 2;
  }

  const gates = [
    getGate(Player.A, 0, 0, width / 2 - 1, width / 2 + 1),
    getGate(Player.B, height, height, width / 2 - 1, width / 2 + 1),
  ];

  const pointer = {
    x: width / 2,
    y: height / 2,
  };

  switch (random(0, 2)) {
    case 0: {
      //two same size indents
      const substractionPosition = Boolean(random(0, 1));
      const substractionWidth = random(1, width / 2 - 2);
      const substractionHeight = random(1, height / 2);
      const substractions = [
        getRelativeSubstraction(
          substractionWidth,
          substractionHeight,
          substractionPosition
            ? MatrixPosition.TOP_LEFT
            : MatrixPosition.TOP_RIGHT
        ),
        getRelativeSubstraction(
          substractionWidth,
          substractionHeight,
          substractionPosition
            ? MatrixPosition.BOTTOM_RIGHT
            : MatrixPosition.BOTTOM_LEFT
        ),
      ];

      const gates = [
        getGate(
          Player.A,
          0,
          0,
          width / 2 -
            1 +
            (substractionPosition
              ? Math.ceil(substractionWidth / 2)
              : Math.floor(-substractionWidth / 2)),
          width / 2 +
            1 +
            (substractionPosition
              ? Math.ceil(substractionWidth / 2)
              : Math.floor(-substractionWidth / 2))
        ),
        getGate(
          Player.B,
          height,
          height,
          width / 2 -
            1 +
            (substractionPosition
              ? Math.floor(-substractionWidth / 2)
              : Math.ceil(substractionWidth / 2)),
          width / 2 +
            1 +
            (substractionPosition
              ? Math.floor(-substractionWidth / 2)
              : Math.ceil(substractionWidth / 2))
        ),
      ];

      return {
        width,
        height,
        substractions,
        gates,
        pointer,
      };
    }

    case 1: {
      //four rectangle indents
      const substractionSize = random(1, width / 2 - 2);

      const substractions = [
        getRelativeSubstraction(
          substractionSize,
          substractionSize,
          MatrixPosition.TOP_LEFT
        ),
        getRelativeSubstraction(
          substractionSize,
          substractionSize,
          MatrixPosition.TOP_RIGHT
        ),
        getRelativeSubstraction(
          substractionSize,
          substractionSize,
          MatrixPosition.BOTTOM_RIGHT
        ),
        getRelativeSubstraction(
          substractionSize,
          substractionSize,
          MatrixPosition.BOTTOM_LEFT
        ),
      ];

      return {
        width,
        height,
        substractions,
        gates,
        pointer,
      };
    }

    case 2: {
      //notches located at left center and right center
      const substractionWidth = random(1, Math.min(width / 2 - 2, 3));
      const substractionHeight = Math.floor(random(1, height / 4)) * 2;

      const substractions = [
        getRelativeSubstraction(
          substractionWidth,
          substractionHeight,
          MatrixPosition.LEFT_CENTER
        ),
        getRelativeSubstraction(
          substractionWidth,
          substractionHeight,
          MatrixPosition.RIGHT_CENTER
        ),
      ];

      return {
        width,
        height,
        substractions,
        gates,
        pointer,
      };
    }
  }

  return {
    width,
    height,
    gates,
    pointer,
  };
}
