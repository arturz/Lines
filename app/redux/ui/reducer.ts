import { UIState } from "./types";
import { Appearance } from "react-native";
import { Reducer } from "redux";
import { TOGGLE_DARK_MODE } from "./actions";

const initialState: UIState = {
  darkMode: Appearance.getColorScheme() === "dark",
};

export const uiReducer: Reducer<UIState> = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode,
      };

    default:
      return state;
  }
};
