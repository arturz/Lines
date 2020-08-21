import { Offset, MapSize, DisplayResolution } from "../../types";

export default ({
  /* size of map */
  width,
  height,
  /* available width and height */
  widthPx,
  heightPx,
}: MapSize & DisplayResolution) => {
  let cellPx;
  let offset: Offset = {
    height: 0,
    width: 0,
  };
  if (widthPx / (width + 1) < heightPx / (height + 1)) {
    cellPx = widthPx / (width + 1);
    offset.width = (widthPx - width * cellPx) / 2;
    offset.height = (heightPx - height * cellPx) / 2;
  } else {
    cellPx = heightPx / (height + 1);
    offset.width = (widthPx - width * cellPx) / 2;
    offset.height = (heightPx - height * cellPx) / 2;
  }
  return { cellPx, offset };
};
