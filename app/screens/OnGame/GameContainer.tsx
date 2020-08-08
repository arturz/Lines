import React, { useEffect } from "react";
import { connect } from "react-redux";
import DimensionsWrapper from "../../wrappers/DimensionsWrapper";
import Game from "./Game";
import { CellLineProps } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import { startGame, takeLine, finish, togglePlayer } from "../../actions/game";
import { GameMap, Pointer, Gates } from "../../classes";
import checkFinishByEnclosure from "./utils/checkFinishByEnclosure";
import { Player } from "../../constants";
import getToggledPlayer from "../../utils/getToggledPlayer";
import getStickingPoints from "./utils/getStickingPoints";
import canBePlaced from "./utils/canBePlaced";
import { Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";

const mapStateToProps = ({
  game: { status, map, pointer, player, toggledPlayer, winner, gates },
}) => ({
  status,
  map,
  pointer,
  player,
  toggledPlayer,
  winner,
  gates,
});

const mapDispatchToProps = (dispatch) => ({
  startGame: (width, height) => dispatch(startGame(width, height)),
  takeLine: (y, x, direction, backwards) =>
    dispatch(takeLine(y, x, direction, backwards)),
  finish: (player) => dispatch(finish(player)),
  togglePlayer: () => dispatch(togglePlayer()),
});

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, "Game">;

const GameContainer = ({
  status,
  map,
  pointer,
  startGame: dispatchStartName,
  player,
  toggledPlayer,
  winner,
  takeLine,
  gates,
  togglePlayer,
  finish,
  route,
  navigation: { navigate },
}: {
  status: GameStatus;
  map: GameMap;
  pointer: Pointer;
  player: Player;
  toggledPlayer: boolean;
  winner: Player;
  gates: Gates;
  startGame;
  takeLine;
  togglePlayer;
  finish;
  route: any;
  navigation: GameScreenNavigationProp;
}) => {
  useEffect(() => {
    if (status !== GameStatus.Playing) return;

    if (winner === null) {
      if (checkFinishByEnclosure({ map, pointer })) {
        finish(getToggledPlayer(player));
        return;
      }

      //finishByGoal
      if (
        gates.isOnGate(pointer.getCoordinates().y, pointer.getCoordinates().x)
      ) {
        const gatePlayer = gates.getPlayerBelongingToGate(
          pointer.getCoordinates().y,
          pointer.getCoordinates().x
        );

        //own goal
        if (gatePlayer === player) {
          finish(getToggledPlayer(player));
          return;
        }

        finish(player);
        return;
      }
    }

    if (winner === null && checkFinishByEnclosure({ map, pointer })) {
      finish(getToggledPlayer(player));
      return;
    }

    if (
      !toggledPlayer &&
      getStickingPoints(
        pointer.getCoordinates().y,
        pointer.getCoordinates().x,
        { map }
      ) === 1
    ) {
      togglePlayer();
      return;
    }
  }, [status, map, player, toggledPlayer, pointer, winner]);

  const startGame = () =>
    dispatchStartName(route?.params?.width || 6, route?.params?.height || 10);

  useEffect(startGame, []);

  const onTakeLine = (cellLineProps: CellLineProps) => {
    if (status !== GameStatus.Playing) return;

    if (
      !canBePlaced(cellLineProps.y, cellLineProps.x, cellLineProps.direction, {
        map,
        pointer,
      })
    )
      return;

    takeLine(
      cellLineProps.y,
      cellLineProps.x,
      cellLineProps.direction,
      cellLineProps.backwards
    );
  };

  if (status === GameStatus.Finish) {
    Alert.alert(
      "Finish",
      `The winner is ${winner === Player.A ? "red" : "blue"}!`,
      [
        {
          text: "Go to menu",
          onPress: () => navigate("Menu"),
        },
        {
          text: "Play again",
          onPress: startGame,
        },
      ]
    );
  }

  if (status === GameStatus.Playing || status === GameStatus.Finish)
    return (
      <>
        <DimensionsWrapper
          render={({ widthPx, heightPx }) => (
            <Game
              width={map.width}
              height={map.height}
              widthPx={widthPx}
              heightPx={heightPx}
              onTakeLine={onTakeLine}
            />
          )}
        />
      </>
    );

  return null;
};

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
