//@ts-ignore
import { gsap } from "gsap-rn";
import { View, Text, Easing } from "react-native";
import { Sizes } from "../styles";

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

    tl.set(button, {
      style: {
        width: Sizes.MENU_BUTTON_WIDTH,
        height: Sizes.MENU_BUTTON_HEIGHT,
      },
    });

    //change button's shape to circle-like
    tl.to(button, {
      style: { width: Sizes.MENU_BUTTON_HEIGHT },
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

    //make circle bigger
    tl.to(button, {
      style: {
        width: Sizes.MENU_BUTTON_HEIGHT,
        height: Sizes.MENU_BUTTON_HEIGHT,
      },
      duration: 0.25,
      ease: "tween3",
    });

    //change shape from circle to normal button
    tl.to(button, {
      style: {
        width: Sizes.MENU_BUTTON_WIDTH,
        height: Sizes.MENU_BUTTON_HEIGHT,
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
