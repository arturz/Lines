import { Player } from "../constants";
import { Colors } from "../styles";

export default (player: Player) =>
  player === Player.A ? Colors.RED : Colors.BLUE;
