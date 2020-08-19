import React from "react";
import { ButtonThatOpensModal } from "../../../components/organisms";
import { SelectMapSize } from ".";
import { MenuScreenNavigationProp } from "../../../navigations";

export default ({ navigation }: { navigation: MenuScreenNavigationProp }) => (
  <ButtonThatOpensModal
    buttonTitle={"play with friend\non this device"}
    modalTitle="Map size"
  >
    <SelectMapSize navigation={navigation} />
  </ButtonThatOpensModal>
);
