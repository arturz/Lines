import { Pointer, Gates } from "../../../classes";

export default ({ pointer, gates }: { pointer: Pointer; gates: Gates }) => {
  return gates.isOnGate(pointer.getCoordinates().y, pointer.getCoordinates().x);
};
