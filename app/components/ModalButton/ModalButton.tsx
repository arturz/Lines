import React, { useRef, useState, useEffect } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  BackHandler,
  Alert,
} from "react-native";
import { gsap } from "gsap-rn";
import { BlackPortal } from "react-native-portal";
import { blue, yellow } from "../../constants/colors";
import { AnimationStatus } from "../../constants/AnimationStatus";
import Modal from "./Modal";

const dimensions = {
  width: 250,
  height: 80,
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...dimensions,
  },
  button: {
    backgroundColor: blue,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...dimensions,
  },
  text: {
    fontFamily: "Barlow-Regular",
    fontSize: 25,
    color: yellow,
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
  const animationStatus = useRef(AnimationStatus.Ready);
  const button = useRef(null);
  const text = useRef(null);

  const openModal = () =>
    button.current.measure((fx, fy, width, height, px, py) => {
      setModal({ open: true, top: py + height / 2 });
    });

  const closeModal = () => setModal({ open: false, top: null });

  function shrink() {
    if (modal.open) return;

    const tl = gsap.timeline();
    tl.set(text.current, { style: { bottom: 0 } });
    tl.to(text.current, {
      style: { bottom: 80 },
      duration: 0.25,
      ease: "tween3",
    });
    tl.set(button.current, { style: { ...dimensions } });
    tl.to(button.current, {
      style: { width: dimensions.height },
      duration: 0.25,
      ease: "tween3",
    });
    tl.to(button.current, {
      style: { width: 40, height: 40 },
      duration: 0.25,
      ease: "tween3",
      onComplete() {
        openModal();
      },
    });
  }

  function stretch() {
    closeModal();
    const tl = gsap.timeline();
    tl.to(button.current, {
      style: { width: dimensions.height, height: dimensions.height },
      duration: 0.25,
      ease: "tween3",
    });
    tl.to(button.current, {
      style: { ...dimensions },
      duration: 0.25,
      ease: "tween3",
    });
    tl.to(text.current, {
      style: { bottom: 0 },
      duration: 0.25,
      ease: "tween3",
    });
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
