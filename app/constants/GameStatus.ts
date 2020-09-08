export enum GameStatus {
  //default state
  Ready = "Ready",
  //after initializeGame (with dimensions and map)
  Initialized = "Initialized",
  //after startGame (players connected)
  Playing = "Playing",
  Paused = "Paused",
  Finish = "Finish",
}
