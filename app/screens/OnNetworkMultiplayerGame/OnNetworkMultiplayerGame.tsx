import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
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
import { generateMapSeed } from "../../utils";
import { RouteProp } from "@react-navigation/native";
import { renderAlerts } from "./renderAlerts";
import { checkHost, AlertData } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [showOpponentLeftAlert, setShowOpponentLeftAlert] = useState(false);

  function resetState() {
    setGame(null);
    setShowExpiredLinkAlert(false);
    setShowLeavePrompt(false);
    setShowOpponentLeftAlert(false);
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

  //opponent left the game - we should destroy the game
  function onOpponentLeft() {
    game?.__destroy();
    setGame(null);
    setShowOpponentLeftAlert(true);
  }

  //host
  useEffect(() => {
    if (!checkHost(params)) return;

    const mapSeed = generateMapSeed(params.gameSize);

    //initialize UI when we are waiting for opponent
    dispatchInitializeGame(mapSeed, params.gameSize);

    createRoom().then((roomId) => {
      const game = new NetworkGame(roomId, Player.A);
      setGame(game);

      game.emitter.on("opponentLeft", onOpponentLeft);
      game.emitter.on("opponentsAction", dispatch);
      game.emitter.on("opponentConnected", () =>
        startGameAsHost(game, mapSeed, params.gameSize)
      );
    });
  }, []);

  //guest
  useEffect(() => {
    if (checkHost(params)) return;

    checkIfRoomExists(params.id).then((exists) => {
      if (!exists) {
        setShowExpiredLinkAlert(true);
        return;
      }

      const game = new NetworkGame(params.id, Player.B);
      setGame(game);

      game.emitter.on("opponentLeft", onOpponentLeft);
      game.emitter.on("opponentsAction", dispatch);
    });
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
    ...(checkHost(params) ? hostAlerts : guestAlerts),
    {
      component: (props) => (
        <OpponentLeftAlert goToMenu={leaveRoom} {...props} />
      ),
      isOpen: showOpponentLeftAlert,
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

  return (
    <SafeAreaView>
      {(status === GameStatus.Initialized ||
        status === GameStatus.Playing ||
        status === GameStatus.Finish) && (
        <View style={{ width: "100%", height: "100%" }}>
          <GameHeader
            playerAText={checkHost(params) ? `your’s move` : `opponent’s move`}
            playerBText={checkHost(params) ? `opponent’s move` : `your’s move`}
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
        </View>
      )}
      {renderAlerts(alerts)}
    </SafeAreaView>
  );
};

export default withGameDeepLinking(
  connect(mapStateToProps, mapDispatchToProps)(NetworkMultiplayerGame)
);
