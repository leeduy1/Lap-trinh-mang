import { BaseModel } from "../Shared/Interface";
import { Card } from "./Card";

export class ICardOfPlayer extends BaseModel {
  deletedAt: string | null;
  cardPlayerId: string;
  card: Card;
  matchId: string;
  userId: string;
  priority: number;
  isShow: boolean;
  cardInRoomId: string;
}
