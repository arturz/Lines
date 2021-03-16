import React, { useEffect, useRef, useState } from "react";
import { View, BackHandler } from "react-native";
import { Portal } from "react-native-portalize";
import {
  animateButtonThatOpensModal,
  reverseAnimateButtonThatOpensModal,
} from "../../greensock";
import { Colors, EStyleSheet, Sizes } from "../../styles";
import measure from "../../utils/measure";
import MenuButton from "../molecules/MenuButton";
import { ButtonHandles } from "../atoms/Button";
import { Overlay } from "../atoms";
import { ModalHeader } from "../molecules";
import { FromBottom } from "../wrappers";
import { animateModal, reverseAnimateModal } from "../../greensock/Modal";
import { useNavigation } from "@react-navigation/native";
import { useDynamicValue } from "react-native-dynamic";

const styles = EStyleSheet.create({
  buttonContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Sizes.SPACING_DOUBLE,
    height:
      EStyleSheet.value(Sizes.MENU_BUTTON.WIDTH) /
      Sizes.MENU_BUTTON.ASPECT_RATIO,
  },
  modalContainer: {
    position: "absolute",
    left: "10%",
    width: "80%",
    zIndex: 1,
  },
  modal: {
    borderRadius: Sizes.MODAL.BORDER_RADIUS,
    padding: Sizes.MODAL.PADDING,
    elevation: 6,
    opacity: 0,
    overflow: "hidden",
    height: "100%",
  },
});

type ComponentProps = ComponentOwnProps;
type ComponentOwnProps = {
  buttonTitle: string;
  modalTitle: string;
};

enum AnimationState {
  ACTIVE = "ACTIVE",
  ANIMATING_BUTTON = "ANIMATING_BUTTON",
  ANIMATING_MODAL = "ANIMATING_MODAL",
  END = "END",
}

const ButtonThatOpensModal: React.FC<ComponentProps> = ({
  buttonTitle,
  modalTitle,
  children,
}) => {
  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.ACTIVE
  );
  const [modalTop, setModalTop] = useState<number>(0);
  const [animateXButton, setAnimateXButton] = useState<boolean>(false);
  const [overlay, setOverlay] = useState<boolean>(false);

  const buttonComponent = useRef<ButtonHandles>(null);
  const modalComponent = useRef<View>(null);
  const modalContentComponent = useRef<View>(null);

  async function open() {
    if (animationState !== AnimationState.ACTIVE) {
      return;
    }

    if (
      !buttonComponent.current?.button ||
      !buttonComponent.current?.text ||
      !modalComponent.current ||
      !modalContentComponent.current
    ) {
      return;
    }

    setAnimationState(AnimationState.ANIMATING_BUTTON);
    await animateButtonThatOpensModal(
      buttonComponent.current.button,
      buttonComponent.current.text
    );

    const { pageY, height } = await measure(buttonComponent.current.button);
    const top = pageY + height / 2;
    setModalTop(top);

    setAnimationState(AnimationState.ANIMATING_MODAL);
    setOverlay(true);
    await animateModal(
      modalComponent.current,
      modalContentComponent.current,
      top
    );
    setAnimateXButton(true);
    setAnimationState(AnimationState.END);
  }

  async function close() {
    if (animationState !== AnimationState.END) {
      return;
    }

    if (
      !buttonComponent.current?.button ||
      !buttonComponent.current?.text ||
      !modalComponent.current ||
      !modalContentComponent.current
    ) {
      return;
    }

    setAnimationState(AnimationState.ANIMATING_MODAL);
    setAnimateXButton(false);
    setOverlay(false);
    await reverseAnimateModal(
      modalComponent.current,
      modalContentComponent.current
    );

    setAnimationState(AnimationState.ANIMATING_BUTTON);
    await reverseAnimateButtonThatOpensModal(
      buttonComponent.current.button,
      buttonComponent.current.text
    );

    setAnimationState(AnimationState.ACTIVE);
  }

  useEffect(() => {
    if (animationState === AnimationState.END) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          close();
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [animationState]);

  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", close);
    return unsubscribe;
  }, [navigation, animationState]);

  return (
    <>
      <View style={styles.buttonContainer}>
        <MenuButton onPress={open} ref={buttonComponent} margin="none">
          {buttonTitle}
        </MenuButton>
      </View>
      <Portal>
        <Overlay isVisible={overlay} onPress={close} />
        <View style={[styles.modalContainer, { top: modalTop }]}>
          <FromBottom>
            <View
              style={[
                styles.modal,
                { backgroundColor: useDynamicValue(Colors.BACKGROUND_DYNAMIC) },
              ]}
              ref={modalComponent}
            >
              <View ref={modalContentComponent}>
                <ModalHeader
                  title={modalTitle}
                  xButton={{ animate: animateXButton, onPress: close }}
                />
                <View>{children}</View>
              </View>
            </View>
          </FromBottom>
        </View>
      </Portal>
    </>
  );
};

export default ButtonThatOpensModal;
