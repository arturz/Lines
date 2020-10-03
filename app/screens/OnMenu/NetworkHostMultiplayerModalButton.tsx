import React from "react";
import {
  ButtonThatOpensModal,
  SelectMapSize,
} from "../../components/organisms";
import { GameSize } from "../../constants";

export default ({ goToGame }: { goToGame: (GameSize: GameSize) => void }) => (
  <ButtonThatOpensModal
    buttonTitle={"two players\nonline"}
    modalTitle="Map size"
  >
    <SelectMapSize onSelect={goToGame} />
  </ButtonThatOpensModal>
);
