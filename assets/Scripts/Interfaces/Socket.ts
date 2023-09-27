import { Participant } from "../Models/Participant";
import { Room } from "../Models/Room";

export enum EEventSocket {
  JOIN_ROOM = "JOIN_ROOM",
  PLAYER_JOIN = "PLAYER_JOIN",
  EXPRESS_FEELING = "EXPRESS_FEELING",
  ACTION = "ACTION",
  LEAVE_ROOM = "LEAVE_ROOM",
  GET_POKER_HAND = "GET_POKER_HAND",
  SHOWDOWN = "SHOWDOWN",
  SENT_MESSAGE = "SENT_MESSAGE",
  GET_MESSAGE = "GET_MESSAGE",
  GET_EQUITY = "GET_EQUITY",
  CARDS_ROUND_FlOP = "CARDS_ROUND_FlOP",
  CARDS_ROUND_TURN = "CARDS_ROUND_TURN",
  CARDS_ROUND_RIVER = "CARDS_ROUND_RIVER",
  START_MATCH = "START_MATCH",
  DISTRIBUTE_CARDS = "DISTRIBUTE_CARDS",
  NOTIFICATION = "NOTIFICATION",
  FINISHED = "FINISHED",
  ERROR = "ERROR",
  COUNT_DOWN = "COUNT_DOWN",
  PLAYER_WITH_TURN = "PLAYER_WITH_TURN",
}

export interface IExpressFeeling {
  roomId: string;
  userId: string;
  emotion: string;
}

export interface IAddAction {
  type: string;
  betAmount: number;
  round: number;
  matchId: string;
  participantId: string;
  isInitialBettor: boolean;
}

export interface ILeaveRoom {
  userId: string;
  roomId: string;
}

export interface IGetCardsOnTables {
  roomId: string;
  matchId: string;
}

export interface IGetPokerHand {
  listIdCards: string[];
}

export interface IShowdown {
  communityCards: string[];
  cardsOfPlayer: string[];
  roomId: string;
}

export interface ISentMessage {
  message: string;
  userId: string;
  roomId: string;
}

export interface IGetEquity {
  communityCards: string[];
  cardsOfPlayer: string[];
  roomId: string;
}
export interface IPlayerJoin {
  player: Participant;
  room: Room;
}
