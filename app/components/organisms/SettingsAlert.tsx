import React from "react";
import { StyleSheet, View } from "react-native";
import Alert from "./Alert";
import { Paragraph } from "../atoms";
import { ModalExitButton } from "../molecules";
import SelectMapSize from "./SelectMapSize";
import { GameSize } from "../../constants";
import HorizontalLine from "../atoms/HorizontalLine";

const styles = StyleSheet.create({
  buttons: {
    display: "flex",
    alignItems: "center",
  },
});

type ComponentProps = ComponentOwnProps;
type ComponentOwnProps = {
  isOpen: boolean;
  onLeave: () => void;
  onResume: () => void;
  onPlayAgain: (gameSize: GameSize) => void;
};

const SettingsAlert: React.FC<ComponentProps> = ({
  isOpen,
  onLeave,
  onResume,
  onPlayAgain,
}) => (
  <Alert isOpen={isOpen} title="Settings" onClose={onResume}>
    <Paragraph>Generate new map</Paragraph>
    <SelectMapSize onSelect={onPlayAgain} />
    <HorizontalLine>OR</HorizontalLine>
    <View style={styles.buttons}>
      <ModalExitButton onPress={onLeave}>Remove game</ModalExitButton>
    </View>
  </Alert>
);

export default SettingsAlert;
