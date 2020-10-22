import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Title, XButton } from "../atoms";

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 30,
  },
});

type Props = {
  title: ReactNode;
  xButton?:
    | null
    | false
    | {
        animate: boolean;
        onPress: () => void;
      };
};

export default ({ title, xButton }: Props) => {
  return (
    <View style={styles.header}>
      <Title>{title}</Title>
      {xButton && (
        <XButton animate={xButton.animate} onPress={xButton.onPress} />
      )}
    </View>
  );
};
