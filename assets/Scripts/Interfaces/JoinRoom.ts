import { Participant } from "../Models/Participant";
import { Room } from "../Models/Room";
import { INotification } from "./Notification";

export interface IJoinRoom {
  lobbyId: string;
  totalChip: string;
  roomId?: string;
}

export interface IJoinRoomResponse {
  notifications: INotification;
  player: Participant;
  room: Room;
}
