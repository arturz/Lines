export class Room {
  private roomId: string;

  constructor() {
    this.roomId = Math.random().toString(36).slice(2);
  }

  getId() {
    return this.roomId;
  }
}
