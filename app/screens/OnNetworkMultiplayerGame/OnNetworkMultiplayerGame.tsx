import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { LayoutWrapper } from "../../components/wrappers";
import { CellLineProps } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import { startGame, takeLine, store } from "../../redux";
import { GameMap, Pointer } from "../../classes";
import { Direction, Player } from "../../constants";
import {
  LocalMultiplayerGameScreenNavigationProp,
  NetworkHostProp,
  NetworkGuestProp,
} from "../../navigations";
import { GameRenderer, GameLogic } from "../../components/gameRenderer";
import { createRoom, checkIfRoomExists, createNetworkGame } from "../../api";
import ShareLinkAlert from "./ShareLinkAlert";
import JoinedGameAlert from "./JoinedGameAlert";

const mapStateToProps = ({ game: { status, map, pointer, player } }) => ({
  status,
  map,
  pointer,
  player,
});

const mapDispatchToProps = (dispatch) => ({
  startGame: (width, height) => dispatch(startGame(width, height)),
  takeLine: (y, x, direction, backwards) =>
    dispatch(takeLine(y, x, direction, backwards)),
});

const LocalMultiplayerGame = ({
  status,
  map,
  pointer,
  player,
  startGame: dispatchStartGame,
  takeLine: dispatchTakeLine,
  route: { params },
  navigation,
}: {
  status: GameStatus;
  map: GameMap;
  pointer: Pointer;
  player: Player;
  startGame: (width: number, height: number) => void;
  takeLine: (
    y: number,
    x: number,
    direction: Direction,
    backwards: boolean
  ) => void;
  route: {
    params: (NetworkGuestProp | NetworkHostProp) & {
      width?: number;
      height?: number;
    };
  };
  navigation: LocalMultiplayerGameScreenNavigationProp;
}) => {
  const isHost = params.isHost;

  //@ts-ignore
  const [roomId, setRoomId] = useState(isHost ? null : params.id);
  const gameRef = useRef(null);

  function start() {
    const width = params.width ?? 6;
    const height = params.height ?? 10;
    gameRef.current.action(dispatchStartGame(width, height));
  }

  useEffect(() => {
    if (roomId === null) {
      createRoom().then(setRoomId);
    } else {
      checkIfRoomExists(roomId).then((exists) => {
        if (!exists) throw new Error(`Link has expired!`);
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

      game.emitter.on("roomDestroyed", () => {
        console.log("room has been destroyed");
        navigation.navigate("Menu");
      });

      game.emitter.on("opponentsAction", (action) => {
        store.dispatch(action);
      });

      if (isHost) {
        game.emitter.on("opponentConnected", start);
      }
    }
  }, [roomId]);

  function deleteLink() {
    gameRef.current.leave();
    navigation.navigate("Menu");
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

  return (
    <>
      {isHost && (
        <>
          <ShareLinkAlert
            isOpen={status === GameStatus.Ready}
            id={roomId}
            onAbort={deleteLink}
          />
        </>
      )}
      {isHost || (
        <>
          <JoinedGameAlert isOpen={status === GameStatus.Ready} />
        </>
      )}
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
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalMultiplayerGame);
