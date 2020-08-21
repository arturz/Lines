import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { GameStatus, Player } from "../../constants";
import { GameMap, Pointer, Gates } from "../../classes";
import { finish, togglePlayer } from "../../redux";
import {
  checkFinishByEnclosure,
  getToggledPlayer,
  getStickingPoints,
} from "../../utils";

const mapStateToProps = ({
  game: { status, map, player, toggledPlayer, pointer, winner, gates },
}) => ({
  status,
  map,
  player,
  toggledPlayer,
  pointer,
  winner,
  gates,
});

const mapDispatchToProps = (dispatch) => ({
  finish: (player) => dispatch(finish(player)),
  togglePlayer: () => dispatch(togglePlayer()),
});

type Props = {
  status: GameStatus;
  map: GameMap;
  player: Player;
  toggledPlayer: Player;
  pointer: Pointer;
  winner: Player;
  gates: Gates;
  finish: (winner: Player) => void;
  togglePlayer: () => void;
  children: React.ReactChild;
};

const GameLogic = memo(
  ({
    status,
    map,
    player,
    toggledPlayer,
    pointer,
    winner,
    gates,
    finish,
    togglePlayer,
    children,
  }: Props) => {
    //runs every render
    useEffect(() => {
      //only run the game logic code during gameplay
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
          {
            map,
          }
        ) === 1
      ) {
        togglePlayer();
        return;
      }
    });

    return <>{children}</>;
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GameLogic);
