import { useSelector, TypedUseSelectorHook } from "react-redux";
import { GameState } from "./game/types";
import { combineReducers, createStore, Store } from "redux";
import { gameReducer } from "./game/reducer";

export * from "./game/actions";

export interface RootState {
  game: GameState;
}

const rootReducer = combineReducers({
  game: gameReducer,
});

export function configureStore(): Store<RootState> {
  return createStore(rootReducer, {});
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
