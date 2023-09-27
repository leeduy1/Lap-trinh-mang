import {
  _decorator,
  Component,
  director,
  instantiate,
  Node,
  Prefab,
  sys,
} from "cc";
import { RoomTemplate } from "../RoomTemplate/RoomTemplate";
import { Room } from "../../Models/Room";
import { EEventSocket, IPlayerJoin } from "../../Interfaces";
import { joinRoom } from "../../Services/Room";
import { eventTarget } from "../../Utils/EventTarget";
import { EventNames } from "../../Shared/Enum";
import SocketClient from "../../Utils/Socket";

const { ccclass, property } = _decorator;

@ccclass("Rooms")
export class Rooms extends Component {
  @property(Node)
  container: Node = null;

  @property(Prefab)
  roomPrefab: Prefab | null = null;

  private roomsData: Room[] = []

  renderRooms(rooms: Room[]) {  
    this.roomsData = rooms;  
    for (let i = 0; i < rooms.length; ++i) {
      const room = instantiate(this.roomPrefab);
      const data = rooms[i];
      console.log(rooms[i]);
      
      room.getComponent(RoomTemplate).init(data);
      room.on(Node.EventType.TOUCH_END, () => this.onSelectedRoom(i), this);
      
      this.container.addChild(room);
    }
  }

  async onSelectedRoom(roomIndex:number) {
    const socket = SocketClient.getClient();
    const informationLobby = JSON.parse(sys.localStorage.getItem('information-lobby'));
    const room = this.roomsData[roomIndex];

    const joinRoomResponse = await joinRoom({
      lobbyId: informationLobby.lobbyId,
      totalChip: informationLobby.totalChip,
      roomId: room.id,
    });

    socket.emit(EEventSocket.JOIN_ROOM, {
      player: joinRoomResponse.player,
      room: joinRoomResponse.room,
    });

    socket.on(EEventSocket.PLAYER_JOIN, (data: IPlayerJoin) => {
      if (data.player.userId === informationLobby.userId) {
        sys.localStorage.setItem("room", data.room.id);
        director.loadScene("RoomPokerScene", () => {
          director.emit("notifications", joinRoomResponse.notifications);
        });
        eventTarget.emit(EventNames.CHECK_MUSIC_STATE);
      }
    });
  }
}
