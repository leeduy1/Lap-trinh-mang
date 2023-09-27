import { Card } from "../Models/Card";

export interface ICommunityCard {
  cardOnTableId: string;
  card: Card;
  matchId: string;
  priority: number;
  isShow: boolean;
  cardInRoomId: string;
}
