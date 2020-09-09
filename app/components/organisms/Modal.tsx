import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { FromBottom } from "../wrappers";
import { Colors } from "../../styles";
import { animateModal, reverseAnimateModal } from "../../greensock/Modal";
import { ModalHeader } from "../molecules";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    maxWidth: 420,
    paddingLeft: 30,
    paddingRight: 30,
    zIndex: 1,
  },
  modal: {
    backgroundColor: Colors.BLUE,
    borderRadius: 30,
    padding: 15,
    elevation: 10,
    opacity: 0,
    overflow: "hidden",
  },
  main: {
    marginLeft: 15,
    marginRight: 15,
  },
});

interface Props {
  top: number;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ top, title, onClose, children }: Props) => {
  const modal = useRef(null);
  const content = useRef(null);
  const [animateXButton, setAnimateXButton] = useState(null);

  async function stretch() {
    await animateModal(modal.current, content.current);
    setAnimateXButton(true);
  }

  async function shrink() {
    setAnimateXButton(false);
    await reverseAnimateModal(modal.current, content.current);
    onClose();
  }

  useEffect(() => void requestAnimationFrame(stretch), []);

  useEffect(() => {
    const backAction = () => {
      shrink();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [modal]);

  return (
    <View style={[styles.container, { top }]}>
      <FromBottom>
        <View style={styles.modal} ref={modal}>
          <View ref={content}>
            <ModalHeader
              title={title}
              xButton={{ animate: animateXButton, onPress: shrink }}
            />
            <View style={styles.main}>{children}</View>
          </View>
        </View>
      </FromBottom>
    </View>
  );
};

export default Modal;
