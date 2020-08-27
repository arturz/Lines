// @refresh reset

import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { connect } from "react-redux";
import { LayoutWrapper } from "../../components/wrappers";
import { CellLineProps, Await } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import { startGame, takeLine, store } from "../../redux";
import { Player } from "../../constants";
import {
  LocalMultiplayerGameScreenNavigationProp,
  NetworkHostProp,
  NetworkGuestProp,
} from "../../navigations";
import { GameRenderer, GameLogic } from "../../components/gameRenderer";
import { createRoom, checkIfRoomExists, createNetworkGame } from "../../api";
import ShareLinkAlert from "./ShareLinkAlert";
import JoinedGameAlert from "./JoinedGameAlert";
import LeavePrompt from "./LeavePrompt";
import FinishAlert from "./FinishAlert";
import ExpiredLinkAlert from "./ExpiredLinkAlert";
import OpponentLeftAlert from "./OpponentLeftAlert";

const mapStateToProps = ({ game: { status, player } }) => ({
  status,
  player,
});

const mapDispatchToProps = (dispatch) => ({
  startGame: (width, height) => dispatch(startGame(width, height)),
  takeLine: (y, x, direction, backwards) =>
    dispatch(takeLine(y, x, direction, backwards)),
});

const LocalMultiplayerGame = ({
  status,
  player,
  startGame: dispatchStartGame,
  takeLine: dispatchTakeLine,
  route: { params },
  navigation,
}: {
  status: GameStatus;
  player: Player;
  startGame: typeof startGame;
  takeLine: typeof takeLine;
  route: {
    params: (NetworkGuestProp | NetworkHostProp) & {
      width?: number;
      height?: number;
    };
  };
  navigation: LocalMultiplayerGameScreenNavigationProp;
}) => {
  const isHost = params.isHost;

  //used for showing alert when guest joins room that doesn't exist (expired URL)
  const [showExpiredLinkAlert, setShowExpiredLinkAlert] = useState(false);

  //prompt that allows to leave game
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);

  const [showOpponentLeftAlert, setShowOpponentLeftAlert] = useState(false);

  const [roomId, setRoomId] = useState(null);

  //contains functions for communication with server
  const gameRef = useRef<Await<ReturnType<typeof createNetworkGame>>>(null);

  function resetState() {
    setShowExpiredLinkAlert(false);
    setShowLeavePrompt(false);
    setShowOpponentLeftAlert(false);
    setRoomId(null);
    gameRef.current = null;
  }

  function start() {
    const width = params.width ?? 6;
    const height = params.height ?? 10;
    gameRef.current.action(dispatchStartGame(width, height));
  }

  useEffect(() => {
    //@ts-ignore
    const _roomId = isHost ? null : params.id;

    if (_roomId === null) {
      createRoom().then(setRoomId);
    } else {
      checkIfRoomExists(_roomId).then((exists) => {
        if (!exists) {
          setShowExpiredLinkAlert(true);
        } else {
          setRoomId(_roomId);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (roomId !== null) setup();

    async function setup() {
      const game = await createNetworkGame(
        roomId,
        isHost ? Player.A : Player.B
      );
      gameRef.current = game;

      game.emitter.on("opponentLeft", () => {
        setShowOpponentLeftAlert(true);
      });

      game.emitter.on("opponentsAction", (action) => {
        store.dispatch(action);
      });

      if (isHost) {
        game.emitter.on("opponentConnected", start);
      }
    }
  }, [roomId]);

  function goToMenu() {
    navigation.navigate("Menu");
  }

  function leaveRoom() {
    //disconnect
    gameRef.current.leave();

    //reset state
    resetState();

    //go to menu
    goToMenu();
  }

  //use only when you are host and noone else is connected, in other cases use leaveRoom
  function __destroyRoom() {
    gameRef.current.__destroy();
    goToMenu();
  }

  const onTakeLine = (cellLineProps: CellLineProps) => {
    gameRef.current.action(
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
        leaveRoom();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      {(status === GameStatus.Playing || status === GameStatus.Finish) && (
        <View style={StyleSheet.absoluteFill}>
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
                    isHost ? player === Player.A : player === Player.B
                  }
                />
              )}
            />
          </GameLogic>
        </View>
      )}
      <ExpiredLinkAlert isOpen={showExpiredLinkAlert} goToMenu={goToMenu} />
      {isHost ? (
        <>
          <ShareLinkAlert
            isRoomCreated={roomId !== null && gameRef.current !== null}
            isOpen={status === GameStatus.Ready}
            id={roomId}
            onAbort={__destroyRoom}
          />
        </>
      ) : (
        <>
          <JoinedGameAlert isOpen={status === GameStatus.Ready} />
        </>
      )}
      <LeavePrompt
        isOpen={showLeavePrompt}
        onResume={() => setShowLeavePrompt(false)}
        onLeave={leaveRoom}
      />
      <FinishAlert
        isOpen={status === GameStatus.Finish}
        isHost={isHost}
        onPlayAgain={start}
        onLeave={leaveRoom}
      />
      <OpponentLeftAlert isOpen={showOpponentLeftAlert} goToMenu={leaveRoom} />
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalMultiplayerGame);
