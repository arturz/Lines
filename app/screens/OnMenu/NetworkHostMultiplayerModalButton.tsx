import React from "react";
import { ButtonThatOpensModal } from "../../components/organisms";
import SelectMapSize from "./SelectMapSize";
import { GameSize } from "../../constants";

export default ({ goToGame }: { goToGame: (GameSize: GameSize) => void }) => (
  <ButtonThatOpensModal
    buttonTitle={"two players\nonline"}
    modalTitle="Map size"
  >
    <SelectMapSize onSelect={goToGame} />
  </ButtonThatOpensModal>
);
