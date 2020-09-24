import random from "random-int";
import { cond, isEqual, always, pipe } from "lodash/fp";
import { partial } from "lodash";

enum MapTransformType {
  Outside = "outside",
  Inside = "inside",
}

const getMapTransformType = pipe(
  partial(random, 0, 1),
  cond([
    [isEqual(0), always(MapTransformType.Outside)],
    [isEqual(1), always(MapTransformType.Inside)],
  ])
);

export default (width: number, height: number) => {
  const mapSize = "small";

  const mapTransformType = getMapTransformType();

  if (mapTransformType === MapTransformType.Inside) {
  }
};
