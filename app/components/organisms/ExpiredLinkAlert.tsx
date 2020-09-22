import React from "react";
import Alert from "./Alert";
import { Paragraph } from "../atoms";
import { ModalButton } from "../molecules";

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
