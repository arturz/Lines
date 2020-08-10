import React, { useRef, useEffect, useState } from "react";
import { XButton, Title } from "../atoms";
import { View, StyleSheet, BackHandler } from "react-native";
import { FromBottom } from "../wrappers";
import { Colors } from "../../styles";
import { animateModal, reverseAnimateModal } from "../../greensock/Modal";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30,
  },
  modal: {
    backgroundColor: Colors.BLUE,
    borderRadius: 30,
    padding: 15,
    elevation: 10,
    opacity: 0,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
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
  const [animateXButton, setAnimateXButton] = useState(false);

  async function stretch() {
    await animateModal(modal.current, content.current);
    setAnimateXButton(true);
  }

  async function shrink() {
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
    <>
      <View style={[styles.container, { top }]}>
        <FromBottom>
          <View style={styles.modal} ref={modal}>
            <View ref={content}>
              <View style={styles.header}>
                <Title>{title}</Title>
                <XButton onPress={shrink} animate={animateXButton} />
              </View>
              {children}
            </View>
          </View>
        </FromBottom>
      </View>
    </>
  );
};

export default Modal;
