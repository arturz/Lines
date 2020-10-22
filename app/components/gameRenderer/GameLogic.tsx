import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { GameStatus, Player } from "../../constants";
import { finish, togglePlayer, RootState } from "../../redux";
import {
  checkFinishByEnclosure,
  checkIfCouldBounce,
  getToggledPlayer,
} from "../../utils";

type ComponentProps = ComponentOwnProps &
  ComponentStoreProps &
  ComponentDispatchProps;
type ComponentOwnProps = {};
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;
type ComponentDispatchProps = ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = ({
  game: { status, map, player, toggledPlayer, winner },
}: RootState) => ({
  status,
  map,
  player,
  toggledPlayer,
  winner,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  finish: (player: Player) => dispatch(finish(player)),
  togglePlayer: () => dispatch(togglePlayer()),
});

const GameLogic: React.FC<ComponentProps> = memo(
  ({
    status,
    map,
    player,
    toggledPlayer,
    winner,
    finish,
    togglePlayer,
    children,
  }) => {
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
        !checkIfCouldBounce(
          map.pointer.getCoordinates().y,
          map.pointer.getCoordinates().x,
          map
        )
      ) {
        togglePlayer();
        return;
      }
    });

    return <>{children}</>;
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GameLogic);
