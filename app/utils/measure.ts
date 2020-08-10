import { View } from "react-native";

interface Measure {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

export default (component: View) => {
  return new Promise<Measure>((resolve, reject) => {
    component.measure((x, y, width, height, pageX, pageY) => {
      resolve({
        x,
        y,
        width,
        height,
        pageX,
        pageY,
      });
    });
  });
};
