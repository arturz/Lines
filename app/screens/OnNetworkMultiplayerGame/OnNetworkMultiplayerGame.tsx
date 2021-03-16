import React, { useEffect, useState } from "react";
import { View, BackHandler } from "react-native";
import { connect, useDispatch } from "react-redux";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showMessage } from "react-native-flash-message";
import { LayoutWrapper } from "../../components/wrappers";
import { CellLineProps, MapSeed } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import {
  takeLine,
  initializeGame,
  clearGame,
  initializeAndStartGame,
  RootState,
} from "../../redux";
import { GameSize, Player } from "../../constants";
import {
  NetworkMultiplayerGameScreenNavigationProp,
  RootStackParamList,
} from "../../navigations";
import { GameRenderer, GameLogic } from "../../components/gameRenderer";
import { NetworkGameController } from "../../api";
import { compose, Dispatch } from "redux";
import { withGameDeepLinking } from "../../hocs";
import {
  ShareLinkAlert,
  JoinedGameAlert,
  LeavePrompt,
  FinishAlert,
  SettingsAlert,
} from "../../components/organisms";
import { GameHeader } from "../../components/molecules";
import { checkConnection, generateMapSeed } from "../../utils";
import { renderAlerts } from "./renderAlerts";
import { checkHost, AlertData } from "./types";
import LostConnection from "../../components/organisms/LostConnection";
import { useDynamicValue } from "react-native-dynamic";
import { Colors } from "../../styles";

type ComponentProps = ComponentOwnProps &
  ComponentStoreProps &
  ComponentDispatchProps;

type ComponentOwnProps = {
  route: RouteProp<RootStackParamList, "NetworkMultiplayerGame">;
  navigation: NetworkMultiplayerGameScreenNavigationProp;
};

type ComponentStoreProps = ReturnType<typeof mapStateToProps>;
type ComponentDispatchProps = ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = ({
  game: { status, player, gameSize },
}: RootState) => ({
  status,
  player,
  gameSize,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initializeGame: compose(dispatch, initializeGame),
  initializeAndStartGame: compose(dispatch, initializeAndStartGame),
  //TS can't figure out type of that specific function (propably a bug - too many params)
  takeLine: compose(dispatch, takeLine) as (
    ...params: Parameters<typeof takeLine>
  ) => ReturnType<typeof takeLine>,
  clearGame: compose(dispatch, clearGame),
});

const NetworkMultiplayerGame: React.FC<ComponentProps> = ({
  status,
  player,
  gameSize, //for restarting game
  initializeGame: dispatchInitializeGame,
  initializeAndStartGame: dispatchInitializeAndStartGame,
  takeLine: dispatchTakeLine,
  clearGame: dispatchClearGame,
  route: { params },
  navigation,
}) => {
  //contains functions for communication with server
  const [
    gameController,
    setGameController,
  ] = useState<NetworkGameController | null>(null);

  //prompt that allows to leave the game
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);
  const [showSettingsAlert, setShowSettingsAlert] = useState(false);
  const [lostConnection, setLostConnection] = useState(false);
  useEffect(() => {
    checkConnection().then((isConnected) => {
      if (!isConnected) setLostConnection(true);
    });
  }, []);

  function resetState() {
    setGameController(null);
    setShowLeavePrompt(false);
    setLostConnection(false);
  }

  function goToMenu() {
    navigation.navigate("Menu");
  }

  function leaveRoom() {
    gameController?.removeRoom();
    goToMenu();
  }

  async function startGame(
    gameController: NetworkGameController,
    mapSeed: MapSeed,
    gameSize: GameSize
  ) {
    await gameController.addAction(
      dispatchInitializeAndStartGame(mapSeed, gameSize)
    );
  }

  function restartGame(_gameSize = gameSize) {
    if (gameController !== null)
      startGame(gameController, generateMapSeed(_gameSize), _gameSize);
  }

  const dispatch = useDispatch();
  function attachCommonGameControllerListeners(
    gameController: NetworkGameController
  ) {
    gameController
      .onAction(dispatch)
      .onRoomRemoved(() => {
        showMessage({
          type: "info",
          message: "Room was removed",
        });
        goToMenu();
      })
      .onLog((log) => {
        switch (log) {
          case "initialConnect":
            showMessage({
              type: "success",
              message: "Connected to server",
            });
            break;

          case "reconnect":
            showMessage({
              type: "success",
              message: "Reconnected",
            });
            break;

          case "disconnect":
            showMessage({
              type: "danger",
              message: "Lost connection",
            });
            break;

          case "opponentDisconnect":
            showMessage({
              type: "info",
              message: "Opponent is disconnected",
            });
            break;

          case "opponentReconnect":
            showMessage({
              type: "success",
              message: "Opponent is reconnected",
            });
            break;
        }
      });
  }

  //host
  useEffect(() => {
    (async function () {
      if (!checkHost(params)) return;

      const mapSeed = generateMapSeed(params.gameSize);

      //initialize UI when we are waiting for the opponent
      dispatchInitializeGame(mapSeed, params.gameSize);

      try {
        const gameController = new NetworkGameController(Player.A);
        attachCommonGameControllerListeners(gameController);
        gameController.onOpponentInitialConnect(() => {
          showMessage({ type: "success", message: "Opponent is connected" });
          startGame(gameController, mapSeed, params.gameSize);
        });

        await gameController.auth();
        await gameController.createRoom();
        setGameController(gameController);
      } catch(error) {
        showMessage({ type: "danger", message: error });
        leaveRoom();
      }
    })();
  }, []);

  //guest
  useEffect(() => {
    (async function () {
      if (checkHost(params)) return;

      try {
        const gameController = new NetworkGameController(Player.B);
        attachCommonGameControllerListeners(gameController);
        await gameController.auth();
        await gameController.joinRoom(params.id);
        setGameController(gameController);
      } catch(error) {
        showMessage({ type: "danger", message: error });
        leaveRoom();
      }
    })();
  }, []);

  const onTakeLine = (cellLineProps: CellLineProps) =>
    gameController?.addAction(
      dispatchTakeLine(
        cellLineProps.y,
        cellLineProps.x,
        cellLineProps.direction,
        cellLineProps.backwards
      )
    );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setShowLeavePrompt(true);
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    return navigation.addListener("blur", () => {
      resetState();
      dispatchClearGame();
    });
  }, [navigation]);

  const hostAlerts: AlertData[] = [
    {
      component: (props) => (
        <ShareLinkAlert
          isRoomCreated={gameController !== null}
          id={gameController?.roomId}
          onAbort={leaveRoom}
          {...props}
        />
      ),
      isOpen: status === GameStatus.Ready || status === GameStatus.Initialized,
    },
  ];

  const guestAlerts: AlertData[] = [
    {
      component: (props) => <JoinedGameAlert {...props} />,
      isOpen: status === GameStatus.Ready || status === GameStatus.Initialized,
    },
  ];

  const alerts: AlertData[] = [
    {
      component: (props) => <LostConnection goToMenu={leaveRoom} {...props} />,
      isOpen: lostConnection,
    },
    ...(checkHost(params) ? hostAlerts : guestAlerts),
    {
      component: (props) => (
        <LeavePrompt
          onResume={() => setShowLeavePrompt(false)}
          onLeave={leaveRoom}
          {...props}
        />
      ),
      isOpen: showLeavePrompt,
    },
    {
      component: (props) => (
        <SettingsAlert
          onResume={() => setShowSettingsAlert(false)}
          onLeave={leaveRoom}
          onPlayAgain={(gameSize) => {
            restartGame(gameSize);
            setShowSettingsAlert(false);
          }}
          {...props}
        />
      ),
      isOpen: showSettingsAlert
    },
    {
      component: (props) => (
        <FinishAlert
          playerAWinnerText={checkHost(params) ? `You win` : `You lose`}
          playerBWinnerText={checkHost(params) ? `You lose` : `You win`}
          onPlayAgain={restartGame}
          onLeave={leaveRoom}
          {...props}
        />
      ),
      isOpen: status === GameStatus.Finish,
    },
  ];

  const backgroundColor = useDynamicValue(Colors.BACKGROUND_DYNAMIC);
  return (
    <SafeAreaView>
      <View style={{ width: "100%", height: "100%", backgroundColor }}>
        {(status === GameStatus.Initialized ||
          status === GameStatus.Playing ||
          status === GameStatus.Finish) && (
          <>
            <GameHeader
              playerAText={
                checkHost(params) ? `your’s move` : `opponent’s move`
              }
              playerBText={
                checkHost(params) ? `opponent’s move` : `your’s move`
              }
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
                    onTakeLine={onTakeLine}
                    allowTakingLine={
                      status === GameStatus.Playing
                        ? checkHost(params)
                          ? player === Player.A
                          : player === Player.B
                        : false
                    }
                  />
                )}
              />
            </GameLogic>
          </>
        )}
        {renderAlerts(alerts)}
      </View>
    </SafeAreaView>
  );
};

export default withGameDeepLinking(
  connect(mapStateToProps, mapDispatchToProps)(NetworkMultiplayerGame)
);
