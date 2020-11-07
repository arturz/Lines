import { useSelector, TypedUseSelectorHook } from "react-redux";
import { GameState } from "./game/types";
import { combineReducers, createStore, Store } from "redux";
import { gameReducer } from "./game/reducer";
import { uiReducer } from "./ui/reducer";
import { UIState } from "./ui/types";

export * from "./game/actions";

export interface RootState {
  game: GameState;
  ui: UIState;
}

const rootReducer = combineReducers({
  game: gameReducer,
  ui: uiReducer,
});

export function configureStore(): Store<RootState> {
  return createStore(rootReducer, {});
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
