import React from "react";
import { ButtonThatOpensModal } from "../../components/organisms";
import SelectMapSize from "./SelectMapSize";
import { GameSize } from "../../constants";

export default ({ goToGame }: { goToGame: (gameSize: GameSize) => void }) => (
  <ButtonThatOpensModal
    buttonTitle={"two players\non this device"}
    modalTitle="Map size"
  >
    <SelectMapSize onSelect={goToGame} />
  </ButtonThatOpensModal>
);
