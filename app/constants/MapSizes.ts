export const SMALL = {
  width: 4 as const,
  height: 4 as const,
};

export const MEDIUM = {
  width: 6 as const,
  height: 8 as const,
};

export const BIG = {
  width: 8 as const,
  height: 12 as const,
};

export default {
  SMALL,
  MEDIUM,
  BIG,
};

export type MapSize = typeof SMALL | typeof MEDIUM | typeof BIG;
