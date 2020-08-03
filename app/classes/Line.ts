import gsap from "gsap";
import { Direction } from "./Direction";
import { AnimationState } from "./AnimationState";

export class Line {
  state = {
    animationState: AnimationState.Ready,
    length: 0,
  };

  constructor(public direction: Direction) {
    this.state = {
      animationState: AnimationState.Ready,
      length: 0,
    };
  }

  startAnimation({ onComplete }: { onComplete?: () => void } = {}) {
    if (this.state.animationState !== AnimationState.Ready) {
      return false;
    }

    gsap.to(this.state, {
      duration: 0.5,
      length: 1,
      ease: "power2",
      onComplete: () => {
        this.state.animationState = AnimationState.Finish;
        if (onComplete) onComplete();
      },
    });

    this.state.animationState = AnimationState.Pending;
  }

  getAnimationState() {
    return this.state.animationState;
  }

  getLength() {
    return this.state.length;
  }
}
