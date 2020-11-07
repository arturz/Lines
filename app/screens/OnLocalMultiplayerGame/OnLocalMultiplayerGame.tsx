import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { connect } from "react-redux";
import { LayoutWrapper } from "../../components/wrappers";
import { CellLineProps } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import {
  takeLine,
  clearGame,
  RootState,
  initializeAndStartGame,
} from "../../redux";
import {
  LocalMultiplayerGameScreenNavigationProp,
  RootStackParamList,
} from "../../navigations";
import { GameRenderer, GameLogic } from "../../components/gameRenderer";
import { compose, Dispatch } from "redux";
import { withGameDeepLinking } from "../../hocs";
import GameHeader from "../../components/molecules/GameHeader";
import {
  LeavePrompt,
  FinishAlert,
  SettingsAlert,
} from "../../components/organisms";
import { generateMapSeed } from "../../utils";
import { GameSize } from "../../constants";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDynamicValue } from "react-native-dynamic";
import { Colors } from "../../styles";

type ComponentProps = ComponentOwnProps &
  ComponentStoreProps &
  ComponentDispatchProps;

type ComponentOwnProps = {
  route: RouteProp<RootStackParamList, "LocalMultiplayerGame">;
  navigation: LocalMultiplayerGameScreenNavigationProp;
};

type ComponentStoreProps = ReturnType<typeof mapStateToProps>;
type ComponentDispatchProps = ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = ({ game: { status } }: RootState) => ({
  status,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initializeAndStartGame: compose(dispatch, initializeAndStartGame),
  takeLine: compose(dispatch, takeLine),
  clearGame: compose(dispatch, clearGame),
});

const LocalMultiplayerGame: React.FC<ComponentProps> = ({
  status,
  initializeAndStartGame: dispatchInitializeAndStartGame,
  takeLine: dispatchTakeLine,
  clearGame: dispatchClearGame,
  route,
  navigation,
}) => {
  //prompt that allows to leave the game
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);

  const [showSettingsAlert, setShowSettingsAlert] = useState(false);

  const start = (gameSize: GameSize) =>
    dispatchInitializeAndStartGame(generateMapSeed(gameSize), gameSize);

  //start game automatically
  useEffect(() => void start(route.params.gameSize), []);

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

  const backgroundColor = useDynamicValue(Colors.BACKGROUND_DYNAMIC);
  return (
    <SafeAreaView>
      <View style={{ width: "100%", height: "100%", backgroundColor }}>
        {(status === GameStatus.Playing || status === GameStatus.Finish) && (
          <>
            <GameHeader
              playerAText="red’s move"
              playerBText="blue’s move"
              onLeaveGameButtonPress={() => setShowLeavePrompt(true)}
              onGameSettingsButtonPress={() => setShowSettingsAlert(true)}
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
          </>
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
        <SettingsAlert
          isOpen={showSettingsAlert}
          onResume={() => setShowSettingsAlert(false)}
          onLeave={leaveRoom}
          onPlayAgain={(gameSize) => {
            start(gameSize);
            setShowSettingsAlert(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default withGameDeepLinking(
  connect(mapStateToProps, mapDispatchToProps)(LocalMultiplayerGame)
);
