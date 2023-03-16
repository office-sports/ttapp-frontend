import io from "socket.io-client";

export class SocketHandler {
  public socket;

  constructor(id: number) {
    this.socket = io(`https://${window.location.hostname}?game_id=${id}`);
  }

  public sendMessage(data: object) {
    this.socket.emit("SEND_MESSAGE", data);
  }
}
