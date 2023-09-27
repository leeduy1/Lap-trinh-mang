import io, { Socket } from "socket.io-client/dist/socket.io.js";
import { getAccessToken } from "./Auth";

class SocketClient {
  private client: Socket = null;

  constructor() {
    const token = getAccessToken();
    this.client = io("https://garena-api.xfsteam.net", {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    });

    this.client.on("connect", () => {
      console.log("Socket connected");
    });

    this.client.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  public getClient() {
    return this.client;
  }
}

export default new SocketClient();
