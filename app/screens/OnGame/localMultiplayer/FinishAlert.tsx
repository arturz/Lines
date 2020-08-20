import React from "react";
import { View, StyleSheet } from "react-native";
import { ModalButton, ModalExitButton } from "../../../components/molecules";
import { Alert } from "../../../components/organisms";
import { GameStatus, Player } from "../../../constants";
import { compose } from "redux";
import { startGame } from "../../../redux";
import { connect } from "react-redux";
import { GameMap } from "../../../classes";

const styles = StyleSheet.create({
  content: {
    display: "flex",
    alignItems: "center",
  },
});

const mapStateToProps = ({ game: { status, winner, map } }) => ({
  status,
  winner,
  map,
});

const mapDispatchToProps = (dispatch) => ({
  playAgain: compose(dispatch, startGame),
});

type Props = {
  status: GameStatus;
  winner: Player;
  map: GameMap;
  goToMenu: () => void;
  playAgain: (width: number, height: number) => void;
};

const FinishAlert = ({ status, winner, map, playAgain, goToMenu }: Props) => {
  const title =
    winner === null
      ? "Playing again"
      : `The winner is ${winner === Player.A ? "red" : "blue!"}`;

  return (
    <Alert title={title} isOpen={status === GameStatus.Finish}>
      <View style={styles.content}>
        <ModalButton onPress={() => playAgain(map.width, map.height)}>
          Play again
        </ModalButton>
        <ModalExitButton onPress={goToMenu}>Go to menu</ModalExitButton>
      </View>
    </Alert>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FinishAlert);
