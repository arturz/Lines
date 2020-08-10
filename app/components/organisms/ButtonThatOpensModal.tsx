import React, { useRef, useState } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { View, Text, StyleSheet } from "react-native";
import { BlackPortal } from "react-native-portal";
import {
  animateButtonThatOpensModal,
  reverseAnimateButtonThatOpensModal,
} from "../../greensock";
import { Colors, Sizes } from "../../styles";
import measure from "../../utils/measure";
import Modal from "../molecules/Modal";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: Sizes.MENU_BUTTON_WIDTH,
    height: Sizes.MENU_BUTTON_HEIGHT,
  },
  button: {
    backgroundColor: Colors.BLUE,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: Sizes.MENU_BUTTON_WIDTH,
    height: Sizes.MENU_BUTTON_HEIGHT,
  },
  text: {
    fontFamily: "Barlow-Regular",
    fontSize: 25,
    color: Colors.YELLOW,
    textTransform: "uppercase",
    textAlign: "center",
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
  const button = useRef(null);
  const text = useRef(null);

  const openModal = async () => {
    const { pageY, height } = await measure(button.current);
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

    await animateButtonThatOpensModal(button.current, text.current);
    openModal();
  }

  function stretch() {
    closeModal();

    reverseAnimateButtonThatOpensModal(button.current, text.current);
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={shrink}>
        <View style={styles.container}>
          <View style={styles.button} ref={button}>
            <Text style={styles.text} ref={text} numberOfLines={2}>
              {buttonTitle}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {modal.open && (
        <BlackPortal name="modal">
          <Modal top={modal.top} onClose={stretch} title={modalTitle}>
            {children}
          </Modal>
        </BlackPortal>
      )}
    </>
  );
};
