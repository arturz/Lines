import React, { useState, useEffect, useRef } from "react";
import { View, Animated, Easing, LayoutChangeEvent } from "react-native";
import { connect } from "react-redux";
import { Colors, EStyleSheet, Sizes } from "../../styles";
import { Player } from "../../constants";
import { getToggledPlayer } from "../../utils";
import { RootState } from "../../redux";
import { useDynamicValue } from "react-native-dynamic";

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    height: Sizes.GAME_HEADER.HEIGHT,
    borderBottomLeftRadius: Sizes.GAME_HEADER.BORDER_RADIUS,
    borderBottomRightRadius: Sizes.GAME_HEADER.BORDER_RADIUS,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
  },
  textbarsContainer: {
    position: "relative",
  },
  textbar: {
    position: "absolute",
    width: "100%",
    fontSize: Sizes.GAME_HEADER.FONT_SIZE,
    fontFamily: "FredokaOne-Regular",
    textAlign: "center",
    textTransform: "uppercase",
  },
});

type ComponentProps = ComponentOwnProps & ComponentStoreProps;
type ComponentOwnProps = {
  playerAText: string;
  playerBText: string;
};
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({ game: { player } }: RootState) => ({
  player,
});

const Indicator: React.FC<ComponentProps> = ({
  player,
  playerAText,
  playerBText,
}) => {
  const [textHeight, setTextHeight] = useState<number>(0);

  const onLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }: LayoutChangeEvent) => setTextHeight(height);

  const animation = useRef(new Animated.Value(1)).current;

  const [fadingOutTextbarText, setFadingOutTextbarText] = useState(" ");
  const [fadingInTextbarText, setFadingInTextbarText] = useState(" ");

  const fadingOutTextbarStyle = {
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(textHeight + 10)],
        }),
      },
    ],
  };

  const fadingInTextbarStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [textHeight + 10, 0],
        }),
      },
    ],
  };

  function getPlayerText(player: Player) {
    if (player === Player.A) return playerAText;
    if (player === Player.B) return playerBText;
    throw new Error(`Undefined player ${player}`);
  }

  useEffect(() => {
    setFadingOutTextbarText(getPlayerText(getToggledPlayer(player)));
    setFadingInTextbarText(getPlayerText(player));

    //reset
    animation.setValue(0);

    Animated.timing(animation, {
      duration: 500,
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [player]);

  const backgroundColor = useDynamicValue(
    Colors.CURRENT_PLAYER_INDICATOR.CONTAINER_DYNAMIC
  );
  const color = useDynamicValue(Colors.CURRENT_PLAYER_INDICATOR.TEXT_DYNAMIC);
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.textbarsContainer, { height: textHeight }]}>
        <Animated.Text
          numberOfLines={1}
          style={[styles.textbar, fadingOutTextbarStyle, { color }]}
        >
          {fadingOutTextbarText}
        </Animated.Text>
        <Animated.Text
          numberOfLines={1}
          style={[styles.textbar, fadingInTextbarStyle, { color }]}
          onLayout={onLayout}
        >
          {fadingInTextbarText}
        </Animated.Text>
      </View>
    </View>
  );
};

export default connect(mapStateToProps)(Indicator);
