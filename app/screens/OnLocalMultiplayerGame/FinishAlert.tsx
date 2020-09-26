import React from "react";
import { View, StyleSheet } from "react-native";
import { ModalButton, ModalExitButton } from "../../components/molecules";
import { Alert } from "../../components/organisms";
import { GameStatus, Player, GameSize } from "../../constants";
import { startGame, initializeGame } from "../../redux";
import { connect } from "react-redux";
import { generateMapSeed } from "../../utils";

const styles = StyleSheet.create({
  content: {
    display: "flex",
    alignItems: "center",
  },
});

const mapStateToProps = ({ game: { status, winner, gameSize } }) => ({
  status,
  winner,
  gameSize,
});

const mapDispatchToProps = (dispatch) => ({
  playAgain: (gameSize: GameSize) => {
    const seed = generateMapSeed(gameSize);
    dispatch(initializeGame(seed, gameSize));
    dispatch(startGame());
  },
});

type Props = {
  status: GameStatus;
  winner: Player;
  gameSize: GameSize;
  goToMenu: () => void;
  playAgain: (gameSize: GameSize) => void;
};

const FinishAlert = ({
  status,
  winner,
  gameSize,
  playAgain,
  goToMenu,
}: Props) => {
  const title =
    winner === null
      ? "Playing again"
      : `The winner is ${winner === Player.A ? "red" : "blue!"}`;

  return (
    <Alert title={title} isOpen={status === GameStatus.Finish}>
      <View style={styles.content}>
        <ModalButton onPress={() => playAgain(gameSize)}>
          Play again
        </ModalButton>
        <ModalExitButton onPress={goToMenu}>Go to menu</ModalExitButton>
      </View>
    </Alert>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FinishAlert);
