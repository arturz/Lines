import { gsap } from "gsap-rn";
import { View, Dimensions } from "react-native";
import { measure } from "../utils";

export function animateModal(modal: View, content: View) {
  return new Promise(async (resolve) => {
    const tl = gsap.timeline();

    const { height } = await measure(modal);

    tl.set(content, { style: { opacity: 0 } });
    tl.set(modal, { style: { opacity: 0, height: 60, width: 0 } });

    //expand width
    tl.to(modal, {
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
      content,
      { style: { opacity: 1 }, duration: 0.5, ease: "tween3" },
      "content"
    );
    tl.to(
      modal,
      {
        style: {
          height,
        },
        duration: 0.5,
        ease: "tween3",
        onComplete() {
          resolve();
        },
      },
      "content"
    );
  });
}

export function reverseAnimateModal(modal: View, content: View) {
  return new Promise((resolve) => {
    const tl = gsap.timeline();

    tl.add("content");

    //hide content
    tl.to(
      content,
      { style: { opacity: 0 }, duration: 0.5, ease: "tween3" },
      "content"
    );

    //shrink modal height
    tl.to(
      modal,
      {
        style: {
          height: 60,
        },
        duration: 0.5,
        ease: "tween3",
      },
      "content"
    );

    //reduce modal width to 0
    tl.to(modal, {
      style: {
        width: 0,
        opacity: 0,
      },
      duration: 0.5,
      ease: "tween3",
      onComplete() {
        resolve();
      },
    });
  });
}
