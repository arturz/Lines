import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { Colors } from "../../styles";
import { Player } from "../../constants";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BLUE,
    padding: 10,
    marginLeft: 60,
    marginRight: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  text: {
    fontSize: 30,
    fontFamily: "Barlow-Medium",
    color: Colors.YELLOW,
    textAlign: "center",
  },
});

const mapStateToProps = ({ game: { player } }) => ({
  player,
});

const Indicator = ({ player }) => (
  <View style={styles.container}>
    <Text style={styles.text}>
      {player === Player.A ? "RED PLAYER" : "BLUE PLAYER"}{" "}
    </Text>
  </View>
);

export default connect(mapStateToProps)(Indicator);
