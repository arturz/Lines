import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { connect } from "react-redux";
import { LayoutWrapper } from "../../components/wrappers";
import { CellLineProps } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import {
  startGame,
  takeLine,
  store,
  initializeGame,
  clearGame,
} from "../../redux";
import { Player } from "../../constants";
import {
  LocalMultiplayerGameScreenNavigationProp,
  NetworkHostProp,
  NetworkGuestProp,
} from "../../navigations";
import { GameRenderer, GameLogic } from "../../components/gameRenderer";
import { createRoom, checkIfRoomExists, NetworkGame } from "../../api";
import ShareLinkAlert from "./ShareLinkAlert";
import JoinedGameAlert from "./JoinedGameAlert";
import LeavePrompt from "./LeavePrompt";
import FinishAlert from "./FinishAlert";
import ExpiredLinkAlert from "./ExpiredLinkAlert";
import OpponentLeftAlert from "./OpponentLeftAlert";
import { compose } from "redux";
import { withGameDeepLinking } from "../../hocs";
import { CurrentPlayerIndicator } from "../../components/atoms";

const mapStateToProps = ({ game: { status, player } }) => ({
  status,
  player,
});

const mapDispatchToProps = (dispatch) => ({
  initializeGame: compose(dispatch, initializeGame),
  startGame: compose(dispatch, startGame),
  takeLine: compose(dispatch, takeLine),
  clearGame: compose(dispatch, clearGame),
});

const LocalMultiplayerGame = ({
  status,
  player,
  startGame: dispatchStartGame,
  initializeGame: dispatchInitializeGame,
  takeLine: dispatchTakeLine,
  clearGame: dispatchClearGame,
  route: { params },
  navigation,
}: {
  status: GameStatus;
  player: Player;
  startGame: typeof startGame;
  initializeGame: typeof initializeGame;
  takeLine: typeof takeLine;
  clearGame: typeof clearGame;
  route: {
    params: NetworkGuestProp | NetworkHostProp;
  };
  navigation: LocalMultiplayerGameScreenNavigationProp;
}) => {
  const isHost = params.isHost;

  //check for required host's navigation params
  if (isHost) {
    if (
      (params as NetworkHostProp).width === undefined ||
      (params as NetworkHostProp).height === undefined
    )
      throw new Error(`Undefined route's params.width and/or params.height`);
  }

  //used for showing alert when guest joins room that doesn't exist (expired URL)
  const [showExpiredLinkAlert, setShowExpiredLinkAlert] = useState(false);

  //prompt that allows to leave game
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
        (params as NetworkHostProp).width,
        (params as NetworkHostProp).height
      );
    }
  }, []);

  async function startAsHost() {
    console.log("startAsHost");

    await game.action(
      dispatchInitializeGame(
        (params as NetworkHostProp).width,
        (params as NetworkHostProp).height
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

  useEffect(() => {
    function setup(roomId: string) {
      const game = new NetworkGame(roomId, isHost ? Player.A : Player.B);

      game.emitter.on("opponentLeft", () => setShowOpponentLeftAlert(true));
      game.emitter.on("opponentsAction", (action) => {
        store.dispatch(action);
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
          <CurrentPlayerIndicator
            playerAText={isHost ? `your's move` : `opponent's move`}
            playerBText={isHost ? `opponent's move` : `your's move`}
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
          !showOpponentLeftAlert && !showExpiredLinkAlert && showLeavePrompt
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
        isHost={isHost}
        onPlayAgain={restartAsHost}
        onLeave={leaveRoom}
      />
    </>
  );
};

export default withGameDeepLinking(
  connect(mapStateToProps, mapDispatchToProps)(LocalMultiplayerGame)
);
