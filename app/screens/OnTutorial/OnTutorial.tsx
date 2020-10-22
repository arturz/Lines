// @refresh reset

import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Paragraph } from "../../components/atoms";

export default () => {
  return (
    <SafeAreaView>
      <View>
        <Paragraph style={{ color: "eee" }}>
          Lines Game is a turn-based game, starts red player.
        </Paragraph>
        <Paragraph style={{ color: "eee" }}>
          You can jump up walls and drawn linesasd
        </Paragraph>
      </View>
    </SafeAreaView>
  );
};
