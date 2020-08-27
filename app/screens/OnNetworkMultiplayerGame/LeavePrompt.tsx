import React from "react";
import { Alert } from "../../components/organisms";
import { Paragraph } from "../../components/atoms";
import { ModalButton, ModalExitButton } from "../../components/molecules";

export default ({
  isOpen,
  onLeave,
  onResume,
}: {
  isOpen: boolean;
  onLeave: () => void;
  onResume: () => void;
}) => (
  <Alert isOpen={isOpen} title="Are you sure?">
    <Paragraph>Do you want to left the game?</Paragraph>
    <ModalExitButton onPress={onLeave}>Leave the game</ModalExitButton>
    <ModalButton onPress={onResume}>Resume</ModalButton>
  </Alert>
);
