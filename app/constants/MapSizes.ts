export const SMALL = {
  width: 4,
  height: 4,
};

export const MEDIUM = {
  width: 6,
  height: 8,
};

export const BIG = {
  width: 8,
  height: 12,
};

export default {
  SMALL,
  MEDIUM,
  BIG,
};

export type MapSize = typeof SMALL | typeof MEDIUM | typeof BIG;
