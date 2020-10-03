import React from "react";
import {
  ButtonThatOpensModal,
  SelectMapSize,
} from "../../components/organisms";
import { GameSize } from "../../constants";

export default ({ goToGame }: { goToGame: (gameSize: GameSize) => void }) => (
  <ButtonThatOpensModal
    buttonTitle={"two players\non this device"}
    modalTitle="Map size"
  >
    <SelectMapSize onSelect={goToGame} />
  </ButtonThatOpensModal>
);
