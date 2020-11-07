import React from "react";
import { View } from "react-native";
import { useDynamicValue } from "react-native-dynamic";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../redux";
import { toggleDarkMode } from "../../redux/ui/actions";
import { Colors, EStyleSheet, Sizes } from "../../styles";

import MoonIcon from "../../assets/images/moon.svg";
import SunIcon from "../../assets/images/sun.svg";

type ComponentProps = ComponentStoreProps & ComponentDispatchProps;
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;
type ComponentDispatchProps = ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = ({ ui: { darkMode } }: RootState) => ({
  darkMode,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleDarkMode: () => dispatch(toggleDarkMode()),
});

const styles = EStyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: Sizes.DARK_MODE_SWITCH.BOTTOM,
    left: Sizes.DARK_MODE_SWITCH.LEFT,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  switchStyle: {
    justifyContent: "center",
    width: Sizes.DARK_MODE_SWITCH.WIDTH,
    aspectRatio: 2 / 1,
    borderRadius: EStyleSheet.value(Sizes.DARK_MODE_SWITCH.WIDTH) / 2,
  },
  circleStyle: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    margin: Sizes.DARK_MODE_SWITCH.CIRCLE_MARGIN,
    width: Sizes.DARK_MODE_SWITCH.CIRCLE_SIZE,
    aspectRatio: 1,
    borderRadius: EStyleSheet.value(Sizes.DARK_MODE_SWITCH.CIRCLE_SIZE) / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
  icon: {
    height: "100%",
    aspectRatio: 1,
    marginLeft: Sizes.DARK_MODE_SWITCH.LEFT,
  },
});

const DarkModeSwitch: React.FC<ComponentProps> = ({
  toggleDarkMode,
  darkMode,
}) => {
  const offsetX = useSharedValue(0);

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(offsetX.value),
        },
      ],
    };
  });

  function toggle() {
    toggleDarkMode();

    if (darkMode) {
      offsetX.value = 0;
    } else {
      offsetX.value = Sizes.DARK_MODE_SWITCH.TRANSLATE_X;
    }
  }

  const containerBackground = useDynamicValue(
    Colors.DARK_MODE_SWITCH.CONTAINER_DYNAMIC
  );
  const circleBackground = useDynamicValue(
    Colors.DARK_MODE_SWITCH.CIRCLE_DYNAMIC
  );
  const iconColor = useDynamicValue(Colors.DARK_MODE_SWITCH.ICON_DYNAMIC);

  return (
    <>
      <View style={styles.wrapper}>
        <TouchableWithoutFeedback onPress={toggle} style={styles.container}>
          <View
            style={[
              styles.switchStyle,
              { backgroundColor: containerBackground },
            ]}
          >
            <Animated.View
              style={[
                styles.circleStyle,
                circleStyle,
                { backgroundColor: circleBackground },
              ]}
            ></Animated.View>
          </View>
          <View style={styles.icon}>
            {darkMode ? (
              <SunIcon fill={iconColor} width="100%" height="100%" />
            ) : (
              <MoonIcon fill={iconColor} width="100%" height="100%" />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DarkModeSwitch);
