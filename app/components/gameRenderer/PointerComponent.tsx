import React, { memo, useRef, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { MapCellsSizes } from "../../types";
import { Circle as CircleComponent } from "react-native-svg";
import { Colors, Sizes } from "../../styles";
import { RootState } from "../../redux";
import { useDynamicValue } from "react-native-dynamic";
import { Player } from "../../constants";
import usePrevious from "use-previous";
import Animated, {
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ComponentProps = ComponentOwnProps & ComponentStoreProps;
type ComponentOwnProps = MapCellsSizes;
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

const AnimatedCircle = Animated.createAnimatedComponent(CircleComponent);

enum Circle {
  FIRST = "FIRST",
  SECOND = "SECOND",
}

const PointerComponent: React.FC<ComponentProps> = memo(
  ({ pointer, player, cellPx, offset }) => {
    const prevPointer = usePrevious(pointer);
    const prevPlayer = usePrevious(player);
    const animation = useSharedValue(0);
    const visibleCircle = useRef(Circle.FIRST);

    const toggleAnimation = () => {
      if (visibleCircle.current === Circle.FIRST) {
        visibleCircle.current = Circle.SECOND;
        animation.value = 1;
      } else {
        visibleCircle.current = Circle.FIRST;
        animation.value = 0;
      }
    };

    useLayoutEffect(() => {
      //not first render
      if (prevPointer !== undefined) toggleAnimation();
    }, [pointer]);

    const firstCircleAnimatedProps = useAnimatedProps(() => ({
      r: withTiming(interpolate(animation.value, [0, 1], [Sizes.POINTER, 0]), {
        duration: 500,
      }),
    }));

    const secondCircleAnimatedProps = useAnimatedProps(() => ({
      r: withTiming(interpolate(animation.value, [1, 0], [Sizes.POINTER, 0]), {
        duration: 500,
      }),
    }));

    const red = useDynamicValue(Colors.RED_DYNAMIC);
    const blue = useDynamicValue(Colors.BLUE_DYNAMIC);

    const currentCircleProps = {
      cx: pointer.getCoordinates().x * cellPx + offset.width,
      cy: pointer.getCoordinates().y * cellPx + offset.height,
      fill: player === Player.A ? red : blue,
    };

    const previousCircleProps =
      prevPointer !== undefined
        ? {
            cx: prevPointer.getCoordinates().x * cellPx + offset.width,
            cy: prevPointer.getCoordinates().y * cellPx + offset.height,
            fill: prevPlayer === Player.A ? red : blue,
          }
        : currentCircleProps;

    return (
      <>
        <AnimatedCircle
          animatedProps={firstCircleAnimatedProps}
          {...(visibleCircle.current === Circle.FIRST
            ? previousCircleProps
            : currentCircleProps)}
        />
        <AnimatedCircle
          animatedProps={secondCircleAnimatedProps}
          {...(visibleCircle.current === Circle.FIRST
            ? currentCircleProps
            : previousCircleProps)}
        />
      </>
    );
  }
);

export default connect(mapStateToProps)(PointerComponent);
