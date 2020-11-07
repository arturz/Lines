import React, { memo, useRef, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { GameSizes } from "../../types";
import { Circle } from "react-native-svg";
import gsap from "gsap";
import { Colors, Sizes } from "../../styles";
import { RootState } from "../../redux";
import { View } from "react-native";
import { useDynamicValue } from "react-native-dynamic";
import { Player } from "../../constants";

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
    const _circle = useRef<View>(null);

    const red = useDynamicValue(Colors.RED_DYNAMIC);
    const blue = useDynamicValue(Colors.BLUE_DYNAMIC);

    useLayoutEffect(() => {
      const timeline = gsap.timeline();
      const state = { radius: 0 };
      timeline.to(state, {
        radius: Sizes.POINTER,
        ease: "power3",
        duration: 1,
        onUpdate() {
          _circle.current?.setNativeProps({
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
        fill={player === Player.A ? red : blue}
        r={0}
      />
    );
  }
);

export default connect(mapStateToProps)(PointerComponent);
