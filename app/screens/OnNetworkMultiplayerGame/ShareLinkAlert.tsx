import React from "react";
import { Alert } from "../../components/organisms";
import { Paragraph } from "../../components/atoms";
import { ModalButton, ModalExitButton } from "../../components/molecules";
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
  id,
  onAbort,
}: {
  isOpen: boolean;
  id: string;
  onAbort: () => void;
}) => {
  async function shareInviteLink() {
    Share.share({
      message: `Join me in Lines game: ${getInviteLink(id)}`,
    });
  }

  if (id === null)
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