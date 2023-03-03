import io from "socket.io-client";

export class SocketHandler {
  public socket;

  constructor(id: number) {
    this.socket = io(window.location.hostname + ":3001?game_id=" + id);
  }

  public sendMessage(data) {
    this.socket.emit("SEND_MESSAGE", data);
  }
}
