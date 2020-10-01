import React, { memo, useRef, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { GameSizes } from "../../types";
import { Circle } from "react-native-svg";
import { getPlayerColor } from "../../utils";
import gsap from "gsap";
import { Sizes } from "../../styles";
import { RootState } from "../../redux";

type ComponentProps = ComponentOwnProps & ComponentStoreProps;
type ComponentOwnProps = GameSizes;
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({
  game: {
    player,
    map: { pointer },
  },
}: RootState) => ({
  pointer,
  player,
});

const PointerComponent: React.FC<ComponentProps> = memo(
  ({ pointer, player, cellPx, offset }) => {
    const _circle = useRef(null);

    useLayoutEffect(() => {
      const timeline = gsap.timeline();
      const state = { radius: 0 };
      timeline.to(state, {
        radius: Sizes.POINTER,
        ease: "power3",
        duration: 1,
        onUpdate() {
          _circle.current.setNativeProps({
            r: state.radius,
          });
        },
      });
    }, [pointer]);

    return (
      <Circle
        ref={_circle}
        cx={pointer.getCoordinates().x * cellPx + offset.width}
        cy={pointer.getCoordinates().y * cellPx + offset.height}
        fill={getPlayerColor(player)}
        r={0}
      />
    );
  }
);

export default connect(mapStateToProps)(PointerComponent);
