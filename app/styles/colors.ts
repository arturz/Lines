import { DynamicValue } from "react-native-dynamic";

export const TRANSPARENT = "#FFFFFF00";

export const RED_DYNAMIC = new DynamicValue("#ff644c", "#B13623");
export const BLUE_DYNAMIC = new DynamicValue("#5da1ff", "#246acb");

export const BORDERS_DYNAMIC = new DynamicValue("#f9d56e", "#4D4D4D");
export const INSIDE_LINES_DYNAMIC = new DynamicValue("#f3ecc2", "#646464");

const PRIMARY = "#FFDA1B";
const PRIMARY_DARK = "#D3AC5F";
export const PRIMARY_DYNAMIC = new DynamicValue(PRIMARY, PRIMARY_DARK);
export const PRIMARY_TEXT_DYNAMIC = new DynamicValue("#1D1D1E", "#FFFFFF");

const SECONDARY = "#1D1D1E";
const SECONDARY_DARK = "#1D1D1D";
export const SECONDARY_DYNAMIC = new DynamicValue(SECONDARY, SECONDARY_DARK);
export const SECONDARY_TEXT_DYNAMIC = new DynamicValue("#FFFFFF", "#FFFFFF");

export const GRAY = "#C3C3C9";
export const GRAY_DARKER = "#929293";

export const BACKGROUND = "#FFFFFF";
export const BACKGROUND_DARK = "#121212";
export const BACKGROUND_DYNAMIC = new DynamicValue(BACKGROUND, BACKGROUND_DARK);

export const PARAGRAPH_DYNAMIC = new DynamicValue("#929293", "#929293");
export const TITLE_DYNAMIC = new DynamicValue("#1D1D1E", "#FFFFFF");
export const GAME_HEADER_CONTROLS = "#5C677D";
export const MENU_TITLE_DYNAMICS = new DynamicValue("#1D1D1E", "#E1B564");
export const X_BUTTON = {
  CONTAINER_DYNAMIC: new DynamicValue("#C3C3C9", "#FFFFFF"),
  LINES_DYNAMIC: new DynamicValue(BACKGROUND, BACKGROUND_DARK),
};
export const CURRENT_PLAYER_INDICATOR = {
  CONTAINER_DYNAMIC: new DynamicValue("#1D1D1E", "#4D4D4D"),
  TEXT_DYNAMIC: new DynamicValue("#FFFFFF", "#FFFFFF"),
};
export const LEAVE_GAME_BUTTON_DYNAMIC = new DynamicValue("#929293", "#C3C3C9");
export const GAME_SETTINGS_BUTTON_DYNAMIC = new DynamicValue(
  "#929293",
  "#C3C3C9"
);
export const DARK_MODE_SWITCH = {
  CONTAINER_DYNAMIC: new DynamicValue("#1D1D1D", "#FFFFFF"),
  CIRCLE_DYNAMIC: new DynamicValue("#FFFFFF", "#1D1D1D"),
  ICON_DYNAMIC: new DynamicValue("#1D1D1D", "#929293"),
};
