import { BaseModel } from "../Shared/Interface";
import { LobbyItem } from "./Lobby";
import { Participant } from "./Participant";

export class Room extends BaseModel {
  deletedAt: string | null;
  entranceFee: string;
  lobbyId: string;
  key: number;
  lobby: LobbyItem;
  participants: Participant[];
}