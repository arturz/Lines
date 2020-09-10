import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Animated, Easing } from "react-native";
import { connect } from "react-redux";
import { Colors } from "../../styles";
import { Player } from "../../constants";
import { getToggledPlayer } from "../../utils";
import { GAME_HEADER_HEIGHT } from "../../styles/sizes";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.BLUE,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    height: GAME_HEADER_HEIGHT,
    display: "flex",
    justifyContent: "center",
  },
  textbarsContainer: {
    position: "relative",
  },
  textbar: {
    position: "absolute",
    width: "100%",
    fontSize: 30,
    fontFamily: "Barlow-Medium",
    color: Colors.YELLOW,
    textAlign: "center",
    textTransform: "uppercase",
  },
});

const mapStateToProps = ({ game: { player } }) => ({
  player,
});

export type CurrentPlayerIndicatorProps = {
  playerAText: string;
  playerBText: string;
};

type Props = CurrentPlayerIndicatorProps & {
  player: Player;
};

const Indicator = ({ player, playerAText, playerBText }: Props) => {
  const [textHeight, setTextHeight] = useState(null);

  const onLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }) => setTextHeight(height);

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

  return (
    <View style={styles.container}>
      <View style={[styles.textbarsContainer, { height: textHeight }]}>
        <Animated.Text
          numberOfLines={1}
          style={[styles.textbar, fadingOutTextbarStyle]}
        >
          {fadingOutTextbarText}
        </Animated.Text>
        <Animated.Text
          numberOfLines={1}
          style={[styles.textbar, fadingInTextbarStyle]}
          onLayout={onLayout}
        >
          {fadingInTextbarText}
        </Animated.Text>
      </View>
    </View>
  );
};

export default connect(mapStateToProps)(Indicator);
