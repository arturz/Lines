import { Point } from "../types";

/*
  ({ x: 0, y: 0 }, { x: 1, y: 1 })
  makes to
  [[0,0],[0,1],[1,0],[1,1]]
*/
export default (from: Point, to: Point) => {
  const points: Point[] = [];

  let { x: fromX, y: fromY } = from;
  let { x: toX, y: toY } = to;
  if (fromX > toX) [fromX, toX] = [toX, fromX];
  if (fromY > toY) [fromY, toY] = [toY, fromY];

  for (let x = fromX; x <= toX; x++)
    for (let y = fromY; y <= toY; y++) points.push({ x, y });

  return points;
};
