import React from "react";
import TouchableBase, { TouchableProps } from "./TouchableBase";

type Props = TouchableProps & {
  minimumScale?: number;
};

export default ({ minimumScale = 0.95, ...props }: Props) => (
  <TouchableBase
    {...props}
    extend={{
      scale: {
        outputRange: [1, minimumScale],
      },
    }}
  />
);
