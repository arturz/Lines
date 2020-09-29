import { MatrixPosition } from "../../../constants";

export default (width: number, height: number, position: MatrixPosition) => {
  return {
    width,
    height,
    position: position,
  };
};
