import { BaseModel } from "../Shared/Interface";
import { User } from "./User";

export class Participant extends BaseModel {
  deletedAt: string | null;
  totalChip: string;
  isWatcher: boolean;
  userId: string;
  roomId: string;
  user: User;
  isFold: boolean;
  totalBetAmount: string;
  betAmountInRound: string;
  seatKey: number;
  isKicked: boolean;
  isDisconnect: boolean;
}

