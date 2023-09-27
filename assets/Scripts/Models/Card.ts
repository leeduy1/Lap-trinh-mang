import { BaseModel } from "../Shared/Interface";

export enum ECardSuit {
  HEARTS = "HEARTS",
  DIAMOND = "DIAMOND",
  CLUBS = "CLUBS",
  SPADES = "SPADES",
}

export class Card extends BaseModel {
  deletedAt: string | null;
  name: string;
  suit: ECardSuit;
}
