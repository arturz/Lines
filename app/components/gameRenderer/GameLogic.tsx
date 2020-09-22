import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { GameStatus, Player } from "../../constants";
import { finish, togglePlayer } from "../../redux";
import {
  checkFinishByEnclosure,
  getToggledPlayer,
  getStickingPoints,
} from "../../utils";
import { GameMap } from "../../types";

const mapStateToProps = ({
  game: { status, map, player, toggledPlayer, winner },
}) => ({
  status,
  map,
  player,
  toggledPlayer,
  winner,
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
  winner: Player;
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
    winner,
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
        if (checkFinishByEnclosure({ map })) {
          finish(getToggledPlayer(player));
          return;
        }

        //finish by goal
        if (
          map.gates.isOnGate(
            map.pointer.getCoordinates().y,
            map.pointer.getCoordinates().x
          )
        ) {
          const gatePlayer = map.gates.getPlayerBelongingToGate(
            map.pointer.getCoordinates().y,
            map.pointer.getCoordinates().x
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
          map.pointer.getCoordinates().y,
          map.pointer.getCoordinates().x,
          map
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
