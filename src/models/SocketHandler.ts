import io from "socket.io-client";

export class SocketHandler {
  public gameSocket: any;
  public appSocket: any;

  constructor() {}

  public setGameSocket(id: number) {
    const socketPrefix = import.meta.env.VITE_SOCKET_HOST ?? "";
    const socketSuffix = import.meta.env.VITE_SOCKET_SUFFIX ?? "";
    this.gameSocket = io(
      socketPrefix + window.location.hostname + socketSuffix + id
    );
  }

  public setAppSocket() {
    const socketPrefix = import.meta.env.VITE_SOCKET_HOST ?? "";
    const socketSuffix = import.meta.env.VITE_SOCKET_SUFFIX ?? "";
    this.appSocket = io(
      socketPrefix + window.location.hostname + socketSuffix + "-1"
    );
  }

  public sendMessage(data: object) {
    this.gameSocket.emit("SEND_MESSAGE", data);
  }
}
