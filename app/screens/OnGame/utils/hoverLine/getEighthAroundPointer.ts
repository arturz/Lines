import { Point, Offset } from "../../../../types";
import { Pointer } from "../../../../classes";

export interface EightAroundPointerProps {
  pointer: Pointer;
  cellPx: number;
  offset: Offset;
}

export default (
  { x, y }: Point,
  { pointer, cellPx, offset }: EightAroundPointerProps
) => {
  const pointerX = pointer.getCoordinates().x * cellPx + offset.width;
  const pointerY = pointer.getCoordinates().y * cellPx + offset.height;

  let deg = (Math.atan2(y - pointerY, x - pointerX) * 180) / Math.PI;
  if (deg < 0) deg = Math.abs(deg);
  else deg = 360 - deg;

  /*
    From 0 (right) to 7 (right-bottom)
  */
  return Math.floor(((deg + 22.5) / 45) % 8);
};
