import EStyleSheet from "./EStyleSheet";

/* game */
const BASE = "5rem";
export const INSIDE_LINES = EStyleSheet.value(BASE);
export const HOVER_LINES = EStyleSheet.value(BASE);
export const TAKEN_LINES = EStyleSheet.value(BASE);
export const POINTER = EStyleSheet.value(BASE) * 1.2;
export const BORDER = EStyleSheet.value(BASE) * 1.4;
export const GATE = EStyleSheet.value(BASE) * 2.4;
export const CARROT_POWER_UP = EStyleSheet.value(BASE) * 4.5;

export const MENU_BUTTON = {
  WIDTH: "250rem",
  ASPECT_RATIO: 3.5 / 1,
  FONT_SIZE: "22rem",
};

export const MENU_BUTTON_SECONDARY = {
  WIDTH: "200rem",
  ASPECT_RATIO: 3.5 / 1,
  FONT_SIZE: "20rem",
};

export const MODAL_BUTTON = { ...MENU_BUTTON_SECONDARY };

export const SPACING = "10rem";
export const SPACING_DOUBLE = "20rem";

export const GAME_HEADER = {
  HEIGHT: "60rem",
  BORDER_RADIUS: "30rem",
  FONT_SIZE: "30rem",
};

export const PARAGRAPH = {
  FONT_SIZE: "22rem",
};

export const TITLE = {
  FONT_SIZE: "30rem",
};

export const X_BUTTON = {
  WIDTH: "40rem",
};

export const MODAL = {
  BORDER_RADIUS: "25rem",
  PADDING: "15rem",
};

export const MENU_TITLE = {
  FONT_SIZE: "80rem",
  LINE_HEIGHT: "80rem",
  MARGINS_Y: "40rem",
};

export const DARK_MODE_SWITCH = {
  BOTTOM: "8rem",
  LEFT: "8rem",
  WIDTH: "44rem",
  TRANSLATE_X: EStyleSheet.value("23rem"),
  CIRCLE_SIZE: "16rem",
  CIRCLE_MARGIN: "2rem",
};
