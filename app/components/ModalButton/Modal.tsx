import React, { useRef, useState, useEffect } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { gsap } from "gsap-rn";
import { View, Text, StyleSheet, Dimensions, BackHandler } from "react-native";
import { blue, yellow, red } from "../../constants/colors";

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  container: {
    position: "absolute",
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "red",
    zIndex: 3,
  },
  //allows bottom modal prop
  wrapper: {
    position: "relative",
    backgroundColor: "blue",
  },
  //model
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  modal: {
    backgroundColor: blue,
    borderRadius: 30,
    padding: 15,
    elevation: 10,
    height: Dimensions.get("window").height / 2,

    // height: 0,
    opacity: 0,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontFamily: "Barlow-Medium",
    fontSize: 30,
    color: yellow,
    marginLeft: 15,
  },
  closeButton: {
    position: "relative",
    width: 40,
    height: 40,
    backgroundColor: red,
    borderRadius: 40,
  },
  closeButton__a: {
    position: "absolute",
    left: "50%",
    top: "50%",
    height: 30,
    width: 8,
    backgroundColor: yellow,
    borderRadius: 30,
  },
  closeButton__b: {
    position: "absolute",
    left: "50%",
    top: "50%",
    height: 30,
    width: 8,
    backgroundColor: yellow,
    borderRadius: 30,
  },
});

interface Props {
  top: number;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ top, title, onClose, children }: Props) => {
  const [closeButtonLayout, setCloseButtonLayout] = useState(null);
  const modal = useRef(null);
  const modalContent = useRef(null);
  const a = useRef(null);
  const b = useRef(null);

  function stretch() {
    const tl = gsap.timeline();

    //close button
    tl.set(a.current, { style: { rotation: 0 } });
    tl.set(b.current, { style: { rotation: 0 } });

    //modal content
    tl.set(modalContent.current, { style: { opacity: 0 } });

    //expand width
    tl.set(modal.current, { style: { opacity: 0, height: 60, width: 0 } });
    tl.to(modal.current, {
      style: {
        width: Dimensions.get("window").width - 60,
        opacity: 1,
      },
      duration: 0.5,
      ease: "tween3",
    });

    //expand height and show content
    tl.add("content");
    tl.to(
      modalContent.current,
      { style: { opacity: 1 }, duration: 0.5, ease: "tween3" },
      "content"
    );
    tl.to(
      modal.current,
      {
        style: {
          height: Dimensions.get("window").height / 2,
        },
        duration: 0.5,
        ease: "tween3",
      },
      "content"
    );

    //close button animation
    tl.add("closeButton");
    tl.to(
      a.current,
      { style: { rotation: 45 }, duration: 0.5, ease: "tween3" },
      "closeButton"
    );
    tl.to(
      b.current,
      { style: { rotation: -45 }, duration: 0.5, ease: "tween3" },
      "closeButton"
    );
  }

  function shrink() {
    const tl = gsap.timeline();

    //expand height and show content
    tl.add("content");
    tl.to(
      modalContent.current,
      { style: { opacity: 0 }, duration: 0.5, ease: "tween3" },
      "content"
    );
    tl.to(
      modal.current,
      {
        style: {
          height: 60,
        },
        duration: 0.5,
        ease: "tween3",
      },
      "content"
    );

    tl.to(modal.current, {
      style: {
        width: 0,
        opacity: 0,
      },
      duration: 0.5,
      ease: "tween3",
      onComplete() {
        onClose();
      },
    });
  }

  useEffect(stretch, []);

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

  const closeButtonX = closeButtonLayout ? -closeButtonLayout.width / 2 : 0;

  const closeButtonY = closeButtonLayout ? -closeButtonLayout.height / 2 : 0;

  return (
    <>
      <View style={[styles.container, { top }]}>
        <View style={styles.wrapper}>
          <View style={styles.modalContainer}>
            <View style={styles.modal} ref={modal}>
              <View ref={modalContent}>
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  <TouchableWithoutFeedback onPressIn={shrink}>
                    <View style={styles.closeButton}>
                      <View
                        onLayout={(event) =>
                          setCloseButtonLayout(event.nativeEvent.layout)
                        }
                        style={[
                          styles.closeButton__a,
                          {
                            transform: [
                              { translateX: closeButtonX },
                              { translateY: closeButtonY },
                            ],
                          },
                        ]}
                        ref={a}
                      />
                      <View
                        style={[
                          styles.closeButton__b,
                          {
                            transform: [
                              { translateX: closeButtonX },
                              { translateY: closeButtonY },
                            ],
                          },
                        ]}
                        ref={b}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                {children}
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Modal;
