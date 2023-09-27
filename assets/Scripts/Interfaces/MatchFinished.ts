import { Card } from "../Models/Card";
import { BaseModel } from "../Shared/Interface";

export interface IMatchFinished {
  handCardsOfPlayers: IHandCardsOfPlayers;
  dealsChipOfPLayers: IDealsChipOfPlayer[];
}

interface IDealsChipOfPlayer {
  userId: string;
  chipAmount: string;
}

interface IHandCardsOfPlayers {
  winnerHands: IFinishHand[];
  allHandCards: IFinishHand[];
}

interface IPokerHand {
  hand: IHand[];
  handType: number;
}

interface IFinishHand {
  userId: string;
  pokerHand: IPokerHand;
  handCard: IHand[];
}

interface IHand extends BaseModel {
  deletedAt: string | null;
  priority: number;
  isShow: boolean;
  cardId: string;
  roomId: string;
  card: Card;
}
