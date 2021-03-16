import React, { useEffect } from "react";
import { Dimensions, Easing, Animated, View, StyleSheet } from "react-native";
import { useColorSchemeContext } from "react-native-dynamic";
import { connect } from "react-redux";
import usePrevious from "use-previous";
import { RootState } from "../../redux";
import { Colors, EStyleSheet, Sizes } from "../../styles";

const { width, height } = Dimensions.get("window");
const size = Math.hypot(width, height) * 2;
const halfSize = size / 2;

type ComponentProps = ComponentStoreProps;
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({ ui: { darkMode } }: RootState) => ({
  darkMode,
});

const MenuBackground: React.FC<ComponentProps> = ({ darkMode }) => {
  const animation = new Animated.Value(0);

  const previousDarkMode = usePrevious(darkMode);
  useEffect(() => {
    if (previousDarkMode === undefined)
      //first render
      return;

    animation.setValue(1);
    Animated.timing(animation, {
      duration: 500,
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [darkMode]);

  const light = Colors.BACKGROUND;
  const dark = Colors.BACKGROUND_DARK;
  const backgroundColor = darkMode ? dark : light;
  const toggledBackgroundColor = darkMode ? light : dark;

  return (
    <>
      <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />
      <Animated.View
        style={{
          position: "absolute",
          //position at center of DarkModeSwitch
          bottom:
            -halfSize +
            EStyleSheet.value(Sizes.DARK_MODE_SWITCH.BOTTOM) +
            EStyleSheet.value(Sizes.DARK_MODE_SWITCH.WIDTH) / 4,
          left:
            -halfSize +
            EStyleSheet.value(Sizes.DARK_MODE_SWITCH.LEFT) +
            EStyleSheet.value(Sizes.DARK_MODE_SWITCH.WIDTH) / 2,
          backgroundColor: toggledBackgroundColor,
          width: size,
          height: size,
          borderRadius: size,
          transform: [
            {
              scale: previousDarkMode === darkMode ? 0.0000001 : animation,
            },
          ],
        }}
      />
    </>
  );
};

export default connect(mapStateToProps)(MenuBackground);
