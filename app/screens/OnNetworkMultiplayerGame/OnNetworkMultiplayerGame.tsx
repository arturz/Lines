import React, { useEffect, useState } from "react";
import { View, BackHandler } from "react-native";
import { connect, useDispatch } from "react-redux";
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
import { createRoom, checkIfRoomExists, NetworkGame } from "../../api";
import { compose, Dispatch } from "redux";
import { withGameDeepLinking } from "../../hocs";
import {
  ShareLinkAlert,
  JoinedGameAlert,
  OpponentLeftAlert,
  ExpiredLinkAlert,
  LeavePrompt,
  FinishAlert,
} from "../../components/organisms";
import { GameHeader } from "../../components/molecules";
import { checkConnection, generateMapSeed } from "../../utils";
import { RouteProp } from "@react-navigation/native";
import { renderAlerts } from "./renderAlerts";
import { checkHost, AlertData } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";
import { showMessage } from "react-native-flash-message";
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

const mapStateToProps = ({ game: { status, player } }: RootState) => ({
  status,
  player,
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
  initializeGame: dispatchInitializeGame,
  initializeAndStartGame: dispatchInitializeAndStartGame,
  takeLine: dispatchTakeLine,
  clearGame: dispatchClearGame,
  route: { params },
  navigation,
}) => {
  //contains functions for communication with server
  const [game, setGame] = useState<NetworkGame | null>(null);

  //used for showing alert when guest joins room that doesn't exist (expired URL)
  const [showExpiredLinkAlert, setShowExpiredLinkAlert] = useState(false);
  //prompt that allows to leave the game
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);

  const [hasOpponentLeft, setHasOpponentLeft] = useState(false);

  const [lostConnection, setLostConnection] = useState(false);

  function resetState() {
    setGame(null);
    setShowExpiredLinkAlert(false);
    setShowLeavePrompt(false);
    setHasOpponentLeft(false);
    setLostConnection(false);
  }

  async function startGameAsHost(
    game: NetworkGame,
    mapSeed: MapSeed,
    gameSize: GameSize
  ) {
    if (!checkHost(params)) return;

    await game.action(dispatchInitializeAndStartGame(mapSeed, gameSize));
  }

  const dispatch = useDispatch();

  useEffect(() => {
    //opponent left the game - we should destroy the game
    if (hasOpponentLeft) {
      game?.__destroy();
      setGame(null);
    }
  }, [hasOpponentLeft]);

  function attachCommonGameEmitterEvents(game: NetworkGame) {
    game.emitter.on("left", () => setLostConnection(true));
    game.emitter.on("opponentLeft", () => setHasOpponentLeft(true));
    game.emitter.on("opponentsAction", dispatch);
    game.emitter.on("connected", () => {
      showMessage({
        type: "success",
        message: "Connected to server",
      });
    });
    game.emitter.on("disconnected", () => {
      showMessage({
        type: "danger",
        message: "Lost connection",
      });
    });
  }

  useEffect(() => {
    checkConnection().then((isConnected) => {
      if (!isConnected) setLostConnection(true);
    });
  }, []);

  //host
  useEffect(() => {
    (async function () {
      if (!checkHost(params)) return;

      const mapSeed = generateMapSeed(params.gameSize);

      //initialize UI when we are waiting for opponent
      dispatchInitializeGame(mapSeed, params.gameSize);

      if (!(await checkConnection())) return;

      const roomId = await createRoom();
      const game = new NetworkGame(roomId, Player.A);
      setGame(game);

      attachCommonGameEmitterEvents(game);
      game.emitter.on("opponentConnected", () =>
        startGameAsHost(game, mapSeed, params.gameSize)
      );
    })();
  }, []);

  //guest
  useEffect(() => {
    (async function () {
      if (checkHost(params) || !(await checkConnection())) return;

      const roomExists = checkIfRoomExists(params.id);
      if (!roomExists) {
        setShowExpiredLinkAlert(true);
        return;
      }

      const game = new NetworkGame(params.id, Player.B);
      setGame(game);
      attachCommonGameEmitterEvents(game);
    })();
  }, []);

  function leaveRoom() {
    if (game !== null) {
      //disconnect
      game.leave();
    }

    //reset component's state
    resetState();

    //reset redux's game state
    dispatchClearGame();

    //go to menu
    goToMenu();
  }

  const onTakeLine = (cellLineProps: CellLineProps) =>
    game?.action(
      dispatchTakeLine(
        cellLineProps.y,
        cellLineProps.x,
        cellLineProps.direction,
        cellLineProps.backwards
      )
    );

  const goToMenu = () => navigation.navigate("Menu");

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

  const hostAlerts: AlertData[] = [
    {
      component: (props) => (
        <ShareLinkAlert
          isRoomCreated={game !== null}
          id={game?.roomId}
          onAbort={() => {
            game?.__destroy();
            goToMenu();
          }}
          {...props}
        />
      ),
      isOpen: status === GameStatus.Ready || status === GameStatus.Initialized,
    },
  ];

  const guestAlerts: AlertData[] = [
    {
      component: (props) => <ExpiredLinkAlert goToMenu={goToMenu} {...props} />,
      isOpen: showExpiredLinkAlert,
    },
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
        <OpponentLeftAlert goToMenu={leaveRoom} {...props} />
      ),
      isOpen: hasOpponentLeft,
    },
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
        <FinishAlert
          playerAWinnerText={checkHost(params) ? `You win` : `You lose`}
          playerBWinnerText={checkHost(params) ? `You lose` : `You win`}
          onPlayAgain={() => {
            if (checkHost(params) && game !== null)
              startGameAsHost(
                game,
                generateMapSeed(params.gameSize),
                params.gameSize
              );
          }}
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
