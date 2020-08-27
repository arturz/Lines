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
    <Paragraph>Link has been expired.</Paragraph>
    <ModalButton onPress={goToMenu}>Go back</ModalButton>
  </Alert>
);
