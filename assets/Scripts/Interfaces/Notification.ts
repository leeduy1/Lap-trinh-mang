import BigNumber from "bignumber.js";
import { Participant } from "../Models/Participant";
import { ICommunityCard } from "./CommunityCard";
import { EGameAction } from "./GameAction";

export enum EMatchProgress {
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

export interface INotification {
  smallBlindPlayer: Participant;
  bigBlindPlayer: Participant;
  pot: string;
  matchStatus: EMatchProgress;
  currentPot: string;
  amountToCall: BigNumber;
  currentPlayer: Participant;
  previousPlayer: Participant;
  previousAction: EGameAction;
  communityCards: ICommunityCard[];
  players: Participant[];
  actions: string[];
}
