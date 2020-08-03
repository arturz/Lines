import { Color } from "../classes/Color";

export default (color: Color) =>
  color === Color.Blue ? Color.Red : Color.Blue;
