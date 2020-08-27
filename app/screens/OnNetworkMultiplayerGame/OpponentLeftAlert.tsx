import React from "react";
import { Alert } from "../../components/organisms";
import { Paragraph } from "../../components/atoms";
import { ModalButton } from "../../components/molecules";

export default ({
  isOpen,
  goToMenu,
}: {
  isOpen: boolean;
  goToMenu: () => void;
}) => (
  <Alert title="Oooops!" isOpen={isOpen}>
    <Paragraph>Opponent left the game</Paragraph>
    <ModalButton onPress={goToMenu}>Go to menu</ModalButton>
  </Alert>
);
