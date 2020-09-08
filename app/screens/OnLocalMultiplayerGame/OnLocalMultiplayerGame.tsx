import React, { useEffect } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { connect } from "react-redux";
import { LayoutWrapper } from "../../components/wrappers";
import { CellLineProps } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import { initializeGame, startGame, takeLine, clearGame } from "../../redux";
import { Pointer } from "../../classes";
import FinishAlert from "./FinishAlert";
import { LocalMultiplayerGameScreenNavigationProp } from "../../navigations";
import { GameRenderer, GameLogic } from "../../components/gameRenderer";
import CurrentPlayerIndicator from "../../components/gameRenderer/CurrentPlayerIndicator";
import { compose } from "redux";

const mapStateToProps = ({ game: { status, pointer } }) => ({
  status,
  pointer,
});

const mapDispatchToProps = (dispatch) => ({
  initializeGame: compose(dispatch, initializeGame),
  startGame: compose(dispatch, startGame),
  takeLine: compose(dispatch, takeLine),
  clearGame: compose(dispatch, clearGame),
});

const LocalMultiplayerGame = ({
  status,
  startGame: dispatchStartGame,
  initializeGame: dispatchInitializeGame,
  takeLine: dispatchTakeLine,
  clearGame: dispatchClearGame,
  route,
  navigation,
}: {
  status: GameStatus;
  pointer: Pointer;
  startGame: typeof startGame;
  initializeGame: typeof initializeGame;
  takeLine: typeof takeLine;
  clearGame: typeof clearGame;
  route: any;
  navigation: LocalMultiplayerGameScreenNavigationProp;
}) => {
  //start game automatically
  useEffect(() => {
    dispatchInitializeGame(
      route?.params?.width ?? 6,
      route?.params?.height ?? 10
    );
    dispatchStartGame();
  }, []);

  //dispatch to store
  const onTakeLine = (cellLineProps: CellLineProps) => {
    dispatchTakeLine(
      cellLineProps.y,
      cellLineProps.x,
      cellLineProps.direction,
      cellLineProps.backwards
    );
  };

  const goToMenu = () => navigation.navigate("Menu");

  useEffect(() => {
    const backAction = () => {
      dispatchClearGame();
      goToMenu();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (status === GameStatus.Playing || status === GameStatus.Finish)
    return (
      <View style={StyleSheet.absoluteFill}>
        <CurrentPlayerIndicator
          playerAText="red's move"
          playerBText="blue's move"
        />
        <GameLogic>
          <LayoutWrapper
            render={({ widthPx, heightPx, x, y }) => (
              <GameRenderer
                widthPx={widthPx}
                heightPx={heightPx}
                x={x}
                y={y}
                //on the same device always Player.A or Player.B can take line
                allowTakingLine={status === GameStatus.Playing}
                onTakeLine={onTakeLine}
              />
            )}
          />
          <FinishAlert goToMenu={goToMenu} />
        </GameLogic>
      </View>
    );

  return null;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalMultiplayerGame);
