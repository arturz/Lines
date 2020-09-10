import React from "react";
import Alert from "./Alert";
import { Paragraph } from "../atoms";
import { ModalButton, ModalExitButton } from "../molecules";
import { Share, StyleSheet, View } from "react-native";
import { getInviteLink } from "../../constants";

const styles = StyleSheet.create({
  buttons: {
    display: "flex",
    alignItems: "center",
  },
});

export default ({
  isOpen,
  isRoomCreated,
  id,
  onAbort,
}: {
  isOpen: boolean;
  isRoomCreated: boolean;
  id: string;
  onAbort: () => void;
}) => {
  async function shareInviteLink() {
    Share.share({
      message: `Join me in Lines game: ${getInviteLink(id)}`,
    });
  }

  if (!isRoomCreated)
    return (
      <Alert isOpen={isOpen} title="Creating room...">
        <Paragraph>Link will appear here</Paragraph>
      </Alert>
    );

  return (
    <Alert isOpen={isOpen} title="Waiting for join...">
      <Paragraph>Send link to your friend, so they can join you.</Paragraph>
      <View style={styles.buttons}>
        <ModalButton onPress={shareInviteLink}>Send link</ModalButton>
        <ModalExitButton onPress={onAbort}>Leave room</ModalExitButton>
      </View>
    </Alert>
  );
};
