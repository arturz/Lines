import { Player, Colors } from "../constants";

export default (player: Player) =>
  player === Player.A ? Colors.red : Colors.blue;
