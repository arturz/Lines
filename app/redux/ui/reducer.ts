import { UIState } from "./types";
import { Reducer } from "redux";
import { SET_DARK_MODE, TOGGLE_DARK_MODE } from "./actions";

const initialState: UIState = {
  //look at DarkModeProvider for initial state
  darkMode: undefined,
};

export const uiReducer: Reducer<UIState> = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: state.darkMode ? false : true,
      };

    case SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload,
      };

    default:
      return state;
  }
};
