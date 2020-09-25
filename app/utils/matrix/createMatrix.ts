export default function createMatrix(
  width: number,
  height: number,
  item?: any
) {
  const isItemFunction = typeof item === "function";

  const matrix = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) row.push(isItemFunction ? item() : item);
    matrix.push(row);
  }
  return matrix;
}
