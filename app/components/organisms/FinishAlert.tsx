import React from "react";
import { View, StyleSheet } from "react-native";
import { ModalButton, ModalExitButton } from "../molecules";
import Alert from "./Alert";
import { Player } from "../../constants";
import { connect } from "react-redux";
import { Paragraph } from "../atoms";

const styles = StyleSheet.create({
  content: {
    display: "flex",
    alignItems: "center",
  },
});

const mapStateToProps = ({ game: { winner } }) => ({
  winner,
});

type Props = {
  isOpen: boolean;
  isHost: boolean;
  winner: Player;
  onPlayAgain: () => void;
  onLeave: () => void;
};

const FinishAlert = ({
  isOpen,
  isHost,
  winner,
  onPlayAgain,
  onLeave,
}: Props) => {
  const title =
    winner === null
      ? "Playing again"
      : isHost && winner === Player.A
      ? "You win!"
      : "You lose!";

  return (
    <Alert title={title} isOpen={isOpen}>
      <View style={styles.content}>
        {isHost && (
          <>
            <ModalButton onPress={onPlayAgain}>Play again</ModalButton>
            <ModalExitButton onPress={onLeave}>Remove game</ModalExitButton>
          </>
        )}
        {isHost || <Paragraph>Waiting for host...</Paragraph>}
      </View>
    </Alert>
  );
};

export default connect(mapStateToProps)(FinishAlert);
