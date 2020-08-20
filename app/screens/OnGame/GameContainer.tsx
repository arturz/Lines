import React, { useEffect } from "react";
import { View, StyleSheet, Text, BackHandler } from "react-native";
import { connect } from "react-redux";
import { DimensionsWrapper } from "../../components/wrappers";
import { CellLineProps } from "../../types";
import { GameStatus } from "../../constants/GameStatus";
import { startGame, takeLine, finish, togglePlayer } from "../../redux";
import { GameMap, Pointer, Gates } from "../../classes";
import { Player } from "../../constants";
import getToggledPlayer from "../../utils/getToggledPlayer";
import {
  checkFinishByEnclosure,
  getStickingPoints,
  canBePlaced,
} from "../../utils";
import FinishAlert from "./localMultiplayer/FinishAlert";
import { GameScreenNavigationProp } from "../../navigations";
import GameRenderer from "../../components/gameRenderer/GameRenderer";

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
  navigation,
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
  //start game
  useEffect(() => {
    dispatchStartName(route?.params?.width || 6, route?.params?.height || 10);
  }, []);

  //game logic run every move
  useEffect(() => {
    //only run game logic code during a game
    if (status !== GameStatus.Playing) return;

    //check for a winner
    if (winner === null) {
      //finish by enclosure
      if (checkFinishByEnclosure({ map, pointer })) {
        finish(getToggledPlayer(player));
        return;
      }

      //finish by goal
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

    //toggle player if it is necessary
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

  //game logic - check if player can take line
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

  const goToMenu = () => navigation.navigate("Menu");

  useEffect(() => {
    const backAction = () => {
      goToMenu();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (status === GameStatus.Playing || status === GameStatus.Finish)
    return (
      <View style={StyleSheet.absoluteFill}>
        <DimensionsWrapper
          render={({ widthPx, heightPx }) => (
            <GameRenderer
              width={map.width}
              height={map.height}
              widthPx={widthPx}
              heightPx={heightPx}
              onTakeLine={onTakeLine}
            />
          )}
        />
        <FinishAlert goToMenu={goToMenu} />
      </View>
    );

  return null;
};

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
