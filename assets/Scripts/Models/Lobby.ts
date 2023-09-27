import { BaseModel } from "../Shared/Interface";

export class LobbyItem extends BaseModel {
  deletedAt: string | null;
  name: string;
  smallBlind: string;
  bigBlind: string;
  game: string;
  image: string;
  unitChip: string;
}

export interface Lobby {
  result: LobbyItem[];
}


