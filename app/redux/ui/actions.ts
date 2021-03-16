export const SET_DARK_MODE = "SET_DARK_MODE" as const;
export function setDarkMode(active: boolean) {
  return {
    type: SET_DARK_MODE,
    payload: active,
  };
}

export const TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE" as const;
export function toggleDarkMode() {
  return {
    type: TOGGLE_DARK_MODE,
  };
}
