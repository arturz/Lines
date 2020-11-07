//@ts-ignore
import { gsap } from "gsap-rn";
import { View } from "react-native";

export function animateXButton(firstLine: View, secondLine: View) {
  return new Promise((resolve) => {
    const tl = gsap.timeline();
    tl.add("X-Button");
    tl.to(
      firstLine,
      { style: { rotation: 45 }, duration: 0.5, ease: "tween3" },
      "X-Button"
    );
    tl.to(
      secondLine,
      {
        style: { rotation: -45 },
        duration: 0.5,
        ease: "tween3",
        onComplete: resolve,
      },
      "X-Button"
    );
  });
}

export function reverseAnimateXButton(firstLine: View, secondLine: View) {
  return new Promise((resolve) => {
    const tl = gsap.timeline();
    tl.add("X-Button");
    tl.to(
      firstLine,
      { style: { rotation: 0 }, duration: 0.5, ease: "tween3" },
      "X-Button"
    );
    tl.to(
      secondLine,
      {
        style: { rotation: 0 },
        duration: 0.5,
        ease: "tween3",
        onComplete: resolve,
      },
      "X-Button"
    );
  });
}
