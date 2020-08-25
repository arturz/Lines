import React from "react";
import { ButtonThatOpensModal } from "../../components/organisms";
import SelectMapSize from "./SelectMapSize";
import { MapSize } from "../../constants";

export default ({ goToGame }: { goToGame: (mapSize: MapSize) => void }) => (
  <ButtonThatOpensModal
    buttonTitle={"two players\non this device"}
    modalTitle="Map size"
  >
    <SelectMapSize onSelect={goToGame} />
  </ButtonThatOpensModal>
);
