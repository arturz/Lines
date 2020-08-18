import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { BlackPortal } from "react-native-portal";
import {
  animateButtonThatOpensModal,
  reverseAnimateButtonThatOpensModal,
} from "../../greensock";
import { Sizes } from "../../styles";
import measure from "../../utils/measure";
import Modal from "./Modal";
import MenuButton from "../molecules/MenuButton";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: Sizes.MENU_BUTTON_WIDTH,
    height: Sizes.MENU_BUTTON_HEIGHT,
  },
});

export default ({
  buttonTitle,
  modalTitle,
  children,
}: {
  buttonTitle: string;
  modalTitle: string;
  children: React.ReactNode;
}) => {
  const [modal, setModal] = useState({ open: false, top: null });

  const buttonComponent = useRef(null);

  const button = useRef(null);
  const text = useRef(null);

  const openModal = async () => {
    const { pageY, height } = await measure(buttonComponent.current.button);
    setModal({
      open: true,
      top: pageY + height / 2,
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      top: null,
    });
  };

  async function shrink() {
    if (modal.open) return;

    await animateButtonThatOpensModal(
      buttonComponent.current.button,
      buttonComponent.current.text
    );
    openModal();
  }

  function stretch() {
    closeModal();

    reverseAnimateButtonThatOpensModal(
      buttonComponent.current.button,
      buttonComponent.current.text
    );
  }

  return (
    <>
      <View style={styles.container}>
        <MenuButton onPress={shrink} ref={buttonComponent}>
          {buttonTitle}
        </MenuButton>
      </View>
      {modal.open && (
        <BlackPortal name="modal-portal">
          <Modal top={modal.top} onClose={stretch} title={modalTitle}>
            {children}
          </Modal>
        </BlackPortal>
      )}
    </>
  );
};
