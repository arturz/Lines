//@ts-ignore
import { gsap } from "gsap-rn";
import { View } from "react-native";
import { EStyleSheet, Sizes } from "../styles";
import { measure } from "../utils";

/*
  During second opening .measure() returns height that was previously set by gsap-rn with .to() method.
  Because of that modal cannot become fully opened.
  Height is internally stored with gsap (setNativeProps style.height to undefined/clearProps doesn't work), so it is a way out.
*/
const modalsHeight = new WeakMap<View, number>();

const getShrinkedModalHeight = () =>
  EStyleSheet.value('60rem')

export function animateModal(modal: View, content: View, top: number) {
  return new Promise(async (resolve) => {
    const tl = gsap.timeline();

    let height: number;
    if (modalsHeight.has(modal)) {
      height = modalsHeight.get(modal) as number;
    } else {
      height = (await measure(modal)).height;
      modalsHeight.set(modal, height);
    }

    //make sure part of modal is not above the viewport
    if (height > top)
      tl.set(modal, {
        style: {
          bottom: top - height - EStyleSheet.value(Sizes.SPACING),
        },
      });

    tl.set(content, { style: { opacity: 0 } });
    tl.set(modal, { style: { opacity: 0, height: getShrinkedModalHeight(), width: 0 } });

    //expand width
    tl.to(modal, {
      style: {
        width: EStyleSheet.value("300rem"),
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
          height: getShrinkedModalHeight(),
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
        //reset viewport restriction (if modal's height > top)
        tl.set(modal, {
          style: {
            bottom: 0,
          },
        });
        resolve();
      },
    });
  });
}
