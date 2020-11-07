export const TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE" as const;
export function toggleDarkMode() {
  return {
    type: TOGGLE_DARK_MODE,
  };
}
