import { Player } from "../constants/Player";

export default (player: Player) => (player === Player.A ? Player.B : Player.A);
