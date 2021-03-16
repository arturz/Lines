import { flatMap, sample } from "lodash";
import { Cells, PowerUp } from "../../../types";

export default (cells: Cells): PowerUp => {
  const powerUpIndex = sample(
    Object.entries(flatMap(cells))
    .filter(([index, value]) => value !== null)
    .map(([index]) => index)
  )

  if(powerUpIndex === undefined)
    throw `Can't generate power up`

  const y = Math.floor(+powerUpIndex / cells.length)
  const x = +powerUpIndex % cells[0].length

  return {
    x,
    y,
    type: 'APPLE'
  }
}