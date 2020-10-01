// function used as second argument in memo() to prevent unnecessary updates of borders, inside lines

import { MapSeed } from "../../types";

type Props = {
  seed: MapSeed;
};

export default function <T extends Props>(props: T, nextProps: T) {
  // map's seed
  if (props.seed === nextProps.seed) {
    // don't re-render/update
    return true;
  }
}
