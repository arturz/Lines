import React from "react";
import { View, StyleSheet } from "react-native";
import { ModalButton, ModalExitButton } from "../molecules";
import Alert from "./Alert";
import { Player } from "../../constants";
import { connect } from "react-redux";
import { RootState } from "../../redux";

type ComponentProps = ComponentOwnProps & ComponentStoreProps;

type ComponentOwnProps = {
  isOpen: boolean;
  playerAWinnerText: string;
  playerBWinnerText: string;
  onPlayAgain: () => void;
  onLeave: () => void;
};

type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({ game: { winner } }: RootState) => ({
  winner,
});

const styles = StyleSheet.create({
  content: {
    display: "flex",
    alignItems: "center",
  },
});

const FinishAlert = ({
  isOpen,
  winner,
  playerAWinnerText,
  playerBWinnerText,
  onPlayAgain,
  onLeave,
}: ComponentProps) => {
  const title =
    winner === null
      ? "Playing again"
      : winner === Player.A
      ? playerAWinnerText
      : playerBWinnerText;

  return (
    <Alert title={title} isOpen={isOpen}>
      <View style={styles.content}>
        <ModalButton onPress={onPlayAgain}>Play again</ModalButton>
        <ModalExitButton onPress={onLeave}>Remove game</ModalExitButton>
      </View>
    </Alert>
  );
};

export default connect(mapStateToProps)(FinishAlert);
