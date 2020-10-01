import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { connect, useDispatch } from "react-redux";
import { LayoutWrapper } from "../../components/wrappers";
import { CellLineProps, MapSeed } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import {
  startGame,
  takeLine,
  initializeGame,
  clearGame,
  RootState,
} from "../../redux";
import { Player } from "../../constants";
import {
  NetworkHostProp,
  NetworkGuestProp,
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
  startGame: compose(dispatch, startGame),
  takeLine: compose(dispatch, takeLine),
  clearGame: compose(dispatch, clearGame),
});

function isNetworkHostProp(
  prop: NetworkGuestProp | NetworkHostProp
): prop is NetworkHostProp {
  return (prop as NetworkHostProp).isHost;
}

const NetworkMultiplayerGame: React.FC<ComponentProps> = ({
  status,
  player,
  startGame: dispatchStartGame,
  initializeGame: dispatchInitializeGame,
  takeLine: dispatchTakeLine,
  clearGame: dispatchClearGame,
  route: { params },
  navigation,
}) => {
  const isHost = isNetworkHostProp(params);

  //check for required host's navigation params
  if (isHost && (params as NetworkHostProp).gameSize === undefined) {
    throw new Error(`Undefined gameSize (host)`);
  }

  const seedGeneratedByHost = useRef<MapSeed>(
    isHost ? generateMapSeed((params as NetworkHostProp).gameSize) : null
  );

  //used for showing alert when guest joins room that doesn't exist (expired URL)
  const [showExpiredLinkAlert, setShowExpiredLinkAlert] = useState(false);

  //prompt that allows to leave the game
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);

  const [showOpponentLeftAlert, setShowOpponentLeftAlert] = useState(false);

  //contains functions for communication with server
  const [game, setGame] = useState<NetworkGame>(null);

  function resetState() {
    setShowExpiredLinkAlert(false);
    setShowLeavePrompt(false);
    setShowOpponentLeftAlert(false);
    setGame(null);
  }

  useEffect(() => {
    if (isHost) {
      //initialize UI when we are waiting for opponent
      dispatchInitializeGame(
        seedGeneratedByHost.current,
        (params as NetworkHostProp).gameSize
      );
    }
  }, []);

  async function startAsHost() {
    console.log("startAsHost");

    await game.action(
      dispatchInitializeGame(
        seedGeneratedByHost.current,
        (params as NetworkHostProp).gameSize
      )
    );
    //start game
    await game.action(dispatchStartGame());
  }

  //don't show alert about waiting for opponent when game is restarting
  const restarting = useRef(false);

  //playing again
  async function restartAsHost() {
    restarting.current = true;
    seedGeneratedByHost.current = generateMapSeed(
      (params as NetworkHostProp).gameSize
    );
    await startAsHost();
    restarting.current = false;
  }

  useEffect(() => {
    if (game !== null) {
      if (isHost) {
        game.emitter.on("opponentConnected", startAsHost);
      }
    }
  }, [game]);

  const dispatch = useDispatch();
  useEffect(() => {
    function setup(roomId: string) {
      const game = new NetworkGame(roomId, isHost ? Player.A : Player.B);

      //opponent left the game - we should destroy the game
      game.emitter.on("opponentLeft", () => {
        game.__destroy();
        setGame(null);
        setShowOpponentLeftAlert(true);
      });
      game.emitter.on("opponentsAction", (action) => {
        dispatch(action);
        console.log(
          `dispatched from opponent ${action.type} ${action.payload}`
        );
      });

      setGame(game);
      isHost && console.log("setup done");
    }

    if (isHost) {
      createRoom().then(setup);
      console.log(`created new room (as host)`);
    } else {
      checkIfRoomExists((params as NetworkGuestProp).id).then((exists) => {
        if (!exists) {
          setShowExpiredLinkAlert(true);
        } else {
          setup((params as NetworkGuestProp).id);
        }
      });
    }
  }, []);

  function goToMenu() {
    navigation.navigate("Menu");
  }

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

  //use only when you are host and noone else is connected, in other cases use leaveRoom
  function __destroyRoom() {
    game.__destroy();
    goToMenu();
  }

  const onTakeLine = (cellLineProps: CellLineProps) => {
    game.action(
      dispatchTakeLine(
        cellLineProps.y,
        cellLineProps.x,
        cellLineProps.direction,
        cellLineProps.backwards
      )
    );
  };

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

  const showShareLinkAlert =
    isHost &&
    (status === GameStatus.Ready || status === GameStatus.Initialized) &&
    !restarting.current;

  const showJoinedGameAlert =
    !isHost &&
    (status === GameStatus.Ready || status === GameStatus.Initialized);

  return (
    <>
      {(status === GameStatus.Initialized ||
        status === GameStatus.Playing ||
        status === GameStatus.Finish) && (
        <View style={StyleSheet.absoluteFill}>
          <GameHeader
            playerAText={isHost ? `your’s move` : `opponent’s move`}
            playerBText={isHost ? `opponent’s move` : `your’s move`}
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
                      ? isHost
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

      {/* host */}
      <ShareLinkAlert
        isRoomCreated={game !== null}
        isOpen={showShareLinkAlert}
        id={game?.roomId}
        onAbort={__destroyRoom}
      />
      {/* guest */}
      <JoinedGameAlert isOpen={!showExpiredLinkAlert && showJoinedGameAlert} />

      <OpponentLeftAlert isOpen={showOpponentLeftAlert} goToMenu={leaveRoom} />
      <ExpiredLinkAlert
        isOpen={!showOpponentLeftAlert && showExpiredLinkAlert}
        goToMenu={goToMenu}
      />
      <LeavePrompt
        isOpen={
          !showShareLinkAlert &&
          !showOpponentLeftAlert &&
          !showExpiredLinkAlert &&
          showLeavePrompt
        }
        onResume={() => setShowLeavePrompt(false)}
        onLeave={leaveRoom}
      />
      <FinishAlert
        isOpen={
          !showOpponentLeftAlert &&
          !showExpiredLinkAlert &&
          status === GameStatus.Finish
        }
        playerAWinnerText={isHost ? `You win` : `You lose`}
        playerBWinnerText={isHost ? `You lose` : `You win`}
        onPlayAgain={restartAsHost}
        onLeave={leaveRoom}
      />
    </>
  );
};

export default withGameDeepLinking(
  connect(mapStateToProps, mapDispatchToProps)(NetworkMultiplayerGame)
);
