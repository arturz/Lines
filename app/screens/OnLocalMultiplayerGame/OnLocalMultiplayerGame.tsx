import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { connect } from "react-redux";
import { LayoutWrapper } from "../../components/wrappers";
import { CellLineProps } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import { initializeGame, startGame, takeLine, clearGame } from "../../redux";
import { Pointer } from "../../classes";
import { LocalMultiplayerGameScreenNavigationProp } from "../../navigations";
import { GameRenderer, GameLogic } from "../../components/gameRenderer";
import { compose } from "redux";
import { withGameDeepLinking } from "../../hocs";
import GameHeader from "../../components/molecules/GameHeader";
import { LeavePrompt, FinishAlert } from "../../components/organisms";
import { generateMapSeed } from "../../utils";
import { GameSize } from "../../constants";

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

type Props = {
  status: GameStatus;
  pointer: Pointer;
  startGame: typeof startGame;
  initializeGame: typeof initializeGame;
  takeLine: typeof takeLine;
  clearGame: typeof clearGame;
  route: any;
  navigation: LocalMultiplayerGameScreenNavigationProp;
};

const LocalMultiplayerGame = ({
  status,
  startGame: dispatchStartGame,
  initializeGame: dispatchInitializeGame,
  takeLine: dispatchTakeLine,
  clearGame: dispatchClearGame,
  route,
  navigation,
}: Props) => {
  //prompt that allows to leave the game
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);

  const start = (gameSize: GameSize) => {
    dispatchInitializeGame(generateMapSeed(gameSize), gameSize);
    dispatchStartGame();
  };

  //start game automatically
  useEffect(() => {
    if (typeof route?.params?.gameSize === undefined)
      throw new Error(`Undefined gameSize`);

    start(route?.params?.gameSize);
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

  function leaveRoom() {
    dispatchClearGame();
    goToMenu();
  }

  useEffect(() => {
    const backAction = () => {
      setShowLeavePrompt(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      {(status === GameStatus.Playing || status === GameStatus.Finish) && (
        <View style={StyleSheet.absoluteFill}>
          <GameHeader
            playerAText="red’s move"
            playerBText="blue’s move"
            onLeaveGameButtonPress={() => setShowLeavePrompt(true)}
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
          </GameLogic>
        </View>
      )}
      <FinishAlert
        isOpen={status === GameStatus.Finish}
        playerAWinnerText="Red player wins"
        playerBWinnerText="Blue player wins"
        onLeave={goToMenu}
        onPlayAgain={() => start(route.params.gameSize)}
      />
      <LeavePrompt
        isOpen={showLeavePrompt}
        onResume={() => setShowLeavePrompt(false)}
        onLeave={leaveRoom}
      />
    </>
  );
};

export default withGameDeepLinking<Props>(
  connect(mapStateToProps, mapDispatchToProps)(LocalMultiplayerGame)
);
