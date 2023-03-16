import io from "socket.io-client";

export class SocketHandler {
  public socket;

  constructor(id: number) {
    const socketPrefix = import.meta.env.VITE_SOCKET_HOST ?? "";
    const socketSuffix = import.meta.env.VITE_SOCKET_SUFFIX ?? "";
    this.socket = io(
      socketPrefix + window.location.hostname + socketSuffix + id
    );
  }

  public sendMessage(data: object) {
    this.socket.emit("SEND_MESSAGE", data);
  }
}
