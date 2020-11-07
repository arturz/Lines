//@ts-ignore
import { gsap } from "gsap-rn";
import { View, Text, Easing } from "react-native";
import { EStyleSheet, Sizes } from "../styles";

export function animateButtonThatOpensModal(button: View, text: Text) {
  return new Promise((resolve) => {
    const tl = gsap.timeline();

    //lift up text
    tl.set(text, { style: { bottom: 0, opacity: 1 } });
    tl.to(text, {
      style: { bottom: 80, opacity: 0 },
      duration: 0.25,
      ease: "tween3",
    });

    const originalButtonWidth = EStyleSheet.value(Sizes.MENU_BUTTON.WIDTH);
    const oririnalButtonHeight =
      EStyleSheet.value(Sizes.MENU_BUTTON.WIDTH) /
      Sizes.MENU_BUTTON.ASPECT_RATIO;

    tl.set(button, {
      style: {
        width: originalButtonWidth,
        height: oririnalButtonHeight,
      },
    });

    //change button's shape to circle-like
    tl.to(button, {
      style: { width: oririnalButtonHeight },
      duration: 0.25,
      ease: "tween3",
    });

    //make circle smaller
    tl.to(button, {
      style: { width: 40, height: 40 },
      duration: 0.25,
      ease: Easing.bezier(0, 0.5, 0.5, 1.5),
      onComplete() {
        resolve();
      },
    });
  });
}

export function reverseAnimateButtonThatOpensModal(button: View, text: Text) {
  return new Promise((resolve) => {
    const tl = gsap.timeline();

    const originalButtonWidth = EStyleSheet.value(Sizes.MENU_BUTTON.WIDTH);
    const oririnalButtonHeight =
      EStyleSheet.value(Sizes.MENU_BUTTON.WIDTH) /
      Sizes.MENU_BUTTON.ASPECT_RATIO;

    //make circle bigger
    tl.to(button, {
      style: {
        width: oririnalButtonHeight,
        height: oririnalButtonHeight,
      },
      duration: 0.25,
      ease: "tween3",
    });

    //change shape from circle to normal button
    tl.to(button, {
      style: {
        width: originalButtonWidth,
        height: oririnalButtonHeight,
      },
      duration: 0.25,
      ease: "tween3",
    });

    //lift down text
    tl.to(text, {
      style: { bottom: 0, opacity: 1 },
      duration: 0.25,
      ease: "tween3",
      onComplete() {
        resolve();
      },
    });
  });
}
