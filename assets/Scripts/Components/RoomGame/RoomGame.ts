import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  _decorator,
  Animation,
  AudioClip,
  Button,
  Component,
  director,
  instantiate,
  Label,
  Node,
  Prefab,
  resources,
  Sprite,
  SpriteFrame,
  sys,
  UITransform,
  v3,
} from "cc";
import { Socket } from "socket.io-client";
import { EEventSocket, IMatchFinished, IPlayerJoin } from "../../Interfaces";
import { EGameAction } from "../../Interfaces/GameAction";
import { EMatchProgress, INotification } from "../../Interfaces/Notification";
import { Card } from "../../Models/Card";
import { ICardOfPlayer } from "../../Models/CardOfPlayer";
import { Participant } from "../../Models/Participant";
import { User } from "../../Models/User";
import { BetAmountPopup } from "../../PrefabScripts/BetAmountPopup/BetAmountPopup";
import {
  checkLatestMatchFinished,
  getParticipantInRoom,
} from "../../Services/Room";
import { getProfile } from "../../Utils/Auth";
import SocketClient from "../../Utils/Socket";
import { CheckBtn } from "../CheckBtn/CheckBtn";
import { CommunityCard } from "../CommunityCard/CommunityCard";
import { GameAction } from "../GameAction/GameAction";
import { PlayerFirstCard } from "../PlayerFirstCard/PlayerFirstCard";
import { PlayerPoker } from "../PlayerPoker/PlayerPoker";
import { PlayerSecondCard } from "../PlayerSecondCard/PlayerSecondCard";
import { RaiseBtn } from "../RaiseBtn/RaiseBtn";
const { ccclass, property } = _decorator;

@ccclass("RoomGame")
export class RoomGame extends Component {
  @property(Node)
  Player1: Node = null;

  @property(Node)
  Player2: Node = null;

  @property(Node)
  Player3: Node = null;

  @property(Node)
  Player4: Node = null;

  @property(Node)
  Player5: Node = null;

  @property(Node)
  Player6: Node = null;

  @property(Node)
  Player7: Node = null;

  @property(Node)
  Player8: Node = null;

  @property(Node)
  Player9: Node = null;

  @property(Prefab)
  playerPrefab: Prefab = null;

  @property(Button)
  startButton: Button = null;

  @property(Label)
  waitAnotherPlayerLabel: Label = null;

  @property(Sprite)
  Card1: Sprite = null;

  @property(Sprite)
  Card2: Sprite = null;

  @property(Sprite)
  Card3: Sprite = null;

  @property(Sprite)
  Card4: Sprite = null;

  @property(Sprite)
  Card5: Sprite = null;

  @property(Animation)
  distributeCardAnim: Animation = null;

  @property(Animation)
  potWinnerPlayerAnim: Animation = null;

  @property(AudioClip)
  coinSpill: AudioClip = null;

  @property(AudioClip)
  checkAction: AudioClip = null;

  @property(AudioClip)
  foldAction: AudioClip = null;

  @property(AudioClip)
  allinAction: AudioClip = null;

  @property(AudioClip)
  rasieAction: AudioClip = null;

  @property(AudioClip)
  distributingCard: AudioClip = null;

  @property(AudioClip)
  winnerSound: AudioClip = null;

  @property(Node)
  StatusAction1: Node = null;

  @property(Node)
  StatusAction2: Node = null;

  @property(Node)
  StatusAction3: Node = null;

  @property(Node)
  StatusAction4: Node = null;

  @property(Node)
  StatusAction5: Node = null;

  @property(Node)
  StatusAction6: Node = null;

  @property(Node)
  StatusAction7: Node = null;

  @property(Node)
  StatusAction8: Node = null;

  @property(Node)
  StatusAction9: Node = null;

  @property(Node)
  WinnerAnimation: Node = null;

  @property(Node)
  HandCardStraight: Node = null;

  CardOfOwner: ICardOfPlayer[] = [];

  players: Participant[];

  socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  user: User;

  notificationDataStore: INotification;

  isShowGameAction: boolean;

  roomId: string;

  async onLoad() {
    console.log("RoomGame onLoad-----");
    this.isShowGameAction = false;
    this.HandCardStraight.active = false;
    this.user = getProfile();
    this.roomId = sys.localStorage.getItem("room");

    director.on(
      "notifications",
      (data: INotification) => {
        if (data) {
          this.onNotification(data);
        }
      },
      this
    );

    const res = await getParticipantInRoom(this.roomId);

    this.players = res.data;
    this.toggleStartButton();

    await this.createPlayer(this.players);

    this.socket = SocketClient.getClient();
    this.socket.on(EEventSocket.PLAYER_JOIN, this.onPlayerJoin);
    this.socket.on(EEventSocket.NOTIFICATION, this.onNotification);
    this.socket.on(EEventSocket.DISTRIBUTE_CARDS, this.onDistributeCards);
    this.socket.on(EEventSocket.FINISHED, this.onMatchFinished);
  }

  protected onDestroy(): void {
    console.log("on Destroy");
    this.socket.removeListener(
      EEventSocket.DISTRIBUTE_CARDS,
      this.onDistributeCards
    );
    this.socket.removeListener(EEventSocket.PLAYER_JOIN, this.onPlayerJoin);
    this.socket.removeListener(EEventSocket.NOTIFICATION, this.onNotification);

    this.socket.removeListener(EEventSocket.FINISHED, this.onMatchFinished);
  }

  onMatchFinished = async (matchFinishedData: IMatchFinished) => {
    console.log("finished", this.HandCardStraight);
    this.resetGameAction();
    this.showHandWinner(matchFinishedData);
    this.scheduleOnce(() => {
      this.HandCardStraight.active = false;
      this.resetActionStatus();
      this.resetPlayerCard();
      this.resetCommunityCard();
      this.toggleStartButton();
    }, 5);
  };

  onPlayerJoin = async (data: IPlayerJoin) => {
    console.log("onPlayerJoin", data);

    if (this.players) {
      this.players.push(data.player);
      this.setPlayerJoin(this.players);
      this.toggleStartButton();
    }
  };

  onDistributeCards = async (cardOfPlayer: ICardOfPlayer[]) => {
    this.startButton.node.active = false;
    this.CardOfOwner = cardOfPlayer;
    for (let i = 0; i < 9; i++) {
      const playerNode: Node = this[`Player${i + 1}`];

      if (!playerNode) {
        continue;
      }

      if (playerNode.children.length > 0) {
        this.distributingCard.play();
        this.distributeCardAnim.play(`distributeCardPlayer${i + 1}`);
        await this.delay(1000);
      }
    }
    this.setCard(cardOfPlayer);
    this.showGameAction(this.notificationDataStore);
    this.isShowGameAction = true;
    this.waitAnotherPlayerLabel.node.active = false;
  };

  onNotification = async (notificationData: INotification) => {
    console.log("notificationData", notificationData);
    this.notificationDataStore = notificationData;
    if (this.isShowGameAction) {
      this.showGameAction(notificationData);
    }
    this.showCommunityCard(notificationData);
  };

  async createPlayer(data: Participant[]) {
    let selfIndex = this.players.findIndex(
      (participant) => participant.userId === this.user.id
    );
    let indexOfPlayer = selfIndex;
    let countParticipant = 0;
    let indexOfNode = 5;
    while (countParticipant < this.players.length) {
      if (indexOfPlayer >= this.players.length) {
        indexOfPlayer = 0;
        indexOfNode = 5 - Math.abs(indexOfPlayer - selfIndex);
        if (indexOfNode < 1) {
          indexOfNode = 9 + indexOfNode;
        }
      }

      if (indexOfNode > 9) {
        indexOfNode = 1;
      }

      const player = data[indexOfPlayer];
      const playerNode: Node = instantiate(this.playerPrefab);
      const playerItem: PlayerPoker = playerNode.getComponent(PlayerPoker);
      this.setBetLabel(
        playerItem,
        player.user.nickname,
        player.totalChip,
        player.userId
      );
      this.setPlayer(indexOfNode, playerNode);
      indexOfPlayer++;
      countParticipant++;
      indexOfNode++;
    }
  }

  setPlayer(indexNode: number, playerNode: Node) {
    const playerContainer = this[`Player${indexNode}`];

    if (!playerContainer) {
      return;
    }

    playerContainer.removeAllChildren();
    playerContainer.addChild(playerNode);
  }

  setBetLabel(
    playerItem: PlayerPoker,
    username: string,
    chip: string,
    playerId: string
  ) {
    const usernameLabel = playerItem.username;
    const chipLabel = playerItem.chip;
    usernameLabel.string = username;
    chipLabel.string = chip;
    playerItem.playerId = playerId;
  }

  async setPlayerJoin(data: Participant[]) {
    let countNode = 1;
    let indexOfNode = 6;
    const isLatestMatchFinished = await checkLatestMatchFinished(this.roomId);

    while (countNode <= 8) {
      if (indexOfNode === 9) {
        indexOfNode = 1;
      }

      const playerNode = this[`Player${indexOfNode}`];
      if (!playerNode) {
        continue;
      }
      const newPlayer = data[data.length - 1];
      const newNode: Node = instantiate(this.playerPrefab);
      const playerItem: PlayerPoker = newNode.getComponent(PlayerPoker);
      if (!playerNode.children.length) {
        this.setBetLabel(
          playerItem,
          newPlayer.user.nickname,
          newPlayer.totalChip,
          newPlayer.userId
        );
        if (!isLatestMatchFinished) {
          playerItem.blurPlayer();
        }
        this.setPlayer(indexOfNode, newNode);
        break;
      }
      countNode++;
      indexOfNode++;
    }
  }

  async toggleStartButton() {
    const isLatestMatchFinished = await checkLatestMatchFinished(this.roomId);

    if (!this.startButton) {
      return;
    }

    this.startButton.node.active =
      isLatestMatchFinished && this.players.length > 1;

    this.waitAnotherPlayerLabel.node.active =
      isLatestMatchFinished && this.players.length <= 1;
  }

  async startMatch() {
    const roomId = sys.localStorage.getItem("room");
    const socket = SocketClient.getClient();
    socket.emit(EEventSocket.START_MATCH, { roomId });
  }

  setCard(cardOfPlayer: ICardOfPlayer[]) {
    console.log("setCard");
    const isPostionSelfPlayer = true;

    for (let i = 0; i < 9; i++) {
      const cardOfOwner: Card[] = [];
      const playerNode: Node = this[`Player${i + 1}`];

      if (!playerNode) {
        continue;
      }

      const player = playerNode.getChildByName("PlayerPoker");

      if (player) {
        const playerChildNode = player.getComponent(PlayerPoker);

        for (let j = 0; j < cardOfPlayer.length; j++) {
          if (cardOfPlayer[j].userId === playerChildNode.playerId) {
            cardOfOwner.push(cardOfPlayer[j].card);
          }
        }

        if (cardOfOwner.length) {
          playerChildNode.firstCard.getComponent(PlayerFirstCard).cardId =
            cardOfOwner[0].id;
          playerChildNode.secondCard.getComponent(PlayerSecondCard).cardId =
            cardOfOwner[1].id;

          const ownerCardPaths = cardOfOwner.map((item) =>
            this.getCardPath(item)
          );

          this.setPlayerCard(
            ownerCardPaths,
            playerChildNode,
            isPostionSelfPlayer
          );
        }
      }
    }
  }

  getCardPath(card: Card) {
    const { name, suit } = card;

    return `Card/${name.toLowerCase()}_${suit.toLowerCase()}/spriteFrame`;
  }

  showGameAction(notificationData: INotification) {
    console.log("noti in showGameAction", notificationData);
    const { matchStatus, actions, currentPlayer, players } = notificationData;
    const currentPlayerId: string = currentPlayer.userId;

    for (let i = 0; i < 9; i++) {
      const playerNode: Node = this[`Player${i + 1}`];

      if (!playerNode) {
        continue;
      }

      const player = playerNode.getChildByName("PlayerPoker");

      if (player) {
        console.log("player in showGameAction", player);
        const playerChildNode = player.getComponent(PlayerPoker);

        if (matchStatus === EMatchProgress.FINISHED) {
          continue;
        }

        console.log("showGameAction actions", actions);

        if (!actions?.length) {
          continue;
        }

        const gameActionNode = playerChildNode.gameAction;
        const gameActionComponent = gameActionNode.getComponent(GameAction);
        gameActionComponent.players = players;
        gameActionComponent.playerNodeId = currentPlayerId;

        const { betAmountPopup, foldBtn, checkBtn, raiseBtn, allInBtn } =
          gameActionComponent;

        if (
          playerChildNode.playerId === currentPlayerId &&
          currentPlayerId === this.user.id
        ) {
          console.log("show action button");

          // set player node z index
          playerNode.setSiblingIndex(9);

          // fold btn
          if (actions.includes(EGameAction.FOLD)) {
            foldBtn.node.active = true;
          }

          // Check btn
          if (actions.includes(EGameAction.CALL)) {
            checkBtn.getComponent(CheckBtn).checkLabel.string =
              EGameAction.CALL;
            checkBtn.node.active = true;
          } else if (actions.includes(EGameAction.CHECK)) {
            checkBtn.getComponent(CheckBtn).checkLabel.string =
              EGameAction.CHECK;
            checkBtn.node.active = true;
          }

          // raise btn
          if (actions.includes(EGameAction.RAISE)) {
            raiseBtn.getComponent(RaiseBtn).raiseLabel.string =
              EGameAction.RAISE;
            raiseBtn.node.active = true;
          } else if (actions.includes(EGameAction.BET)) {
            raiseBtn.getComponent(RaiseBtn).raiseLabel.string = EGameAction.BET;
            raiseBtn.node.active = true;
          }

          // all in btn
          if (actions.includes(EGameAction.ALL_IN)) {
            allInBtn.node.active = true;
          }
        } else {
          foldBtn.node.active = false;
          checkBtn.node.active = false;
          allInBtn.node.active = false;
          raiseBtn.node.active = false;
          betAmountPopup.active = false;
          betAmountPopup.getComponent(BetAmountPopup).resetBetPopup();
        }
      }
    }
  }

  resetActionStatus() {
    for (let i = 1; i < 9; i++) {
      const actionNode = this[`StatusAction${i}`] as Node;
      if (!actionNode) {
        continue;
      }

      actionNode.getChildByName("CheckIcon").active = true;
      actionNode.getChildByName("FoldIcon").active = true;
      actionNode.active = false;
    }
  }

  resetActionStatusInMatch() {
    for (let i = 1; i < 9; i++) {
      const actionNode = this[`StatusAction${i}`] as Node;
      if (!actionNode) {
        return;
      }

      if (!actionNode.getChildByName("FoldIcon").active) {
        actionNode.getChildByName("CheckIcon").active = true;
        actionNode.active = false;
      }
    }
  }

  showCommunityCard(notificationData: INotification) {
    const { matchStatus, communityCards } = notificationData;

    const idsCardInRoomOfOwner = this.CardOfOwner.map(
      (card) => card.cardInRoomId
    );
    const idsCardInRoomOfCommunityCard = communityCards.map(
      (card) => card.cardInRoomId
    );

    const listIdCardInRoom = [
      ...idsCardInRoomOfOwner,
      ...idsCardInRoomOfCommunityCard,
    ];

    if (matchStatus === EMatchProgress.FINISHED) {
      return;
    }

    if (!communityCards.length) {
      return;
    }

    for (let i = 0; i < 5; i++) {
      const cardSprite: Sprite = this[`Card${i + 1}`];

      if (!cardSprite) {
        continue;
      }

      if (!communityCards[i]) {
        continue;
      }

      cardSprite.getComponent(CommunityCard).cardId = communityCards[i].card.id;
    }

    const communityCardPaths = communityCards.map((item) =>
      this.getCardPath(item.card)
    );
    resources.load(
      communityCardPaths,
      SpriteFrame,
      (err: any, spriteFrames: SpriteFrame[]) => {
        if (err) {
          throw err;
        }

        for (let i = 0; i < 5; i++) {
          const cardSprite: Sprite = this[`Card${i + 1}`];

          if (!cardSprite) {
            continue;
          }

          let cardSpriteFrame = cardSprite.getComponent(Sprite).spriteFrame;

          if (!cardSpriteFrame) {
            cardSprite.getComponent(UITransform).setContentSize(110, 165);
            cardSprite.getComponent(Sprite).spriteFrame = spriteFrames[i];
          }
        }
      }
    );

    const socket = SocketClient.getClient();
    socket.emit(EEventSocket.GET_POKER_HAND, {
      listIdCards: listIdCardInRoom,
    });

    this.resetActionStatusInMatch();
  }

  delay(milisecond: number) {
    return new Promise((res) => setTimeout(res, milisecond));
  }

  resetGameAction() {
    console.log("reset Game action");
    for (let i = 0; i < 9; i++) {
      const playerNode: Node = this[`Player${i + 1}`];

      const player = playerNode.getChildByName("PlayerPoker");

      if (player) {
        const playerChildNode = player.getComponent(PlayerPoker);
        const gameActionNode = playerChildNode.gameAction;
        const gameActionComponent = gameActionNode.getComponent(GameAction);

        const { betAmountPopup, foldBtn, checkBtn, raiseBtn, allInBtn } =
          gameActionComponent;
        foldBtn.node.active = false;
        checkBtn.node.active = false;
        allInBtn.node.active = false;
        raiseBtn.node.active = false;
        betAmountPopup.active = false;
        this.isShowGameAction = false;
        this.notificationDataStore = null;
      }
    }
  }

  resetPlayerCard() {
    console.log("resetPlayerCard");
    for (let i = 0; i < 9; i++) {
      const playerNode: Node = this[`Player${i + 1}`];

      if (!playerNode) {
        continue;
      }

      const player = playerNode.getChildByName("PlayerPoker");

      if (player) {
        const playerChildNode = player.getComponent(PlayerPoker);
        playerChildNode.firstCard.spriteFrame = null;
        playerChildNode.secondCard.spriteFrame = null;

        const firstCard =
          playerChildNode.firstCard.getComponent(PlayerFirstCard);
        const secondCard =
          playerChildNode.secondCard.getComponent(PlayerSecondCard);

        firstCard.cardId = null;
        secondCard.cardId = null;
        firstCard.border.node.active = false;
        secondCard.border.node.active = false;
      }
    }
  }

  resetCommunityCard() {
    console.log("resetCommunityCard");
    this.HandCardStraight.active = false;
    for (let i = 0; i < 5; i++) {
      const cardSprite: Sprite = this[`Card${i + 1}`];

      if (!cardSprite) {
        continue;
      }

      const cardSpriteFrame = cardSprite.getComponent(Sprite).spriteFrame;

      if (cardSpriteFrame) {
        cardSprite.getComponent(Sprite).spriteFrame = null;
        cardSprite.getComponent(CommunityCard).cardId = null;
        cardSprite.getComponent(CommunityCard).border.node.active = false;
      }
    }
  }

  showHandWinner(matchFinishedData: IMatchFinished) {
    console.log("showHand Winner");
    const {
      handCardsOfPlayers: { allHandCards, winnerHands },
    } = matchFinishedData;

    if (!winnerHands.length) {
      return;
    }

    const winnerIds = winnerHands.map((winner) => winner.userId);

    for (let i = 0; i < 9; i++) {
      const playerNode: Node = this[`Player${i + 1}`];
      if (!playerNode) {
        continue;
      }

      const player = playerNode.getChildByName("PlayerPoker");

      if (!player) {
        continue;
      }

      const playerChildNode = player.getComponent(PlayerPoker);

      const firstCard = playerChildNode.firstCard.getComponent(PlayerFirstCard);
      const secondCard =
        playerChildNode.secondCard.getComponent(PlayerSecondCard);

      const handOfUser = allHandCards.find(
        (item) => item.userId === playerChildNode.playerId
      );

      if (!handOfUser) {
        continue;
      }

      const playerCardPaths = handOfUser.handCard?.map((item) =>
        this.getCardPath(item.card)
      );

      const playerCardIds = handOfUser.handCard?.map((item) => item.cardId);

      if (!playerCardPaths) {
        return;
      }
      this.setPlayerCard(playerCardPaths, playerChildNode);

      if (winnerIds.includes(handOfUser.userId)) {
        const porkerHandCardId = handOfUser.pokerHand?.hand?.map(
          (handItem) => handItem.cardId
        );

        if (!porkerHandCardId?.length) {
          continue;
        }

        if (porkerHandCardId.includes(playerCardIds[0])) {
          this.moveCardUpwards(firstCard);
        }

        if (porkerHandCardId.includes(playerCardIds[1])) {
          this.moveCardUpwards(secondCard);
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      const cardSprite: Sprite = this[`Card${i + 1}`];

      const handOfUser = winnerHands[0];

      if (!handOfUser) {
        continue;
      }

      const porkerHandCardId = handOfUser.pokerHand?.hand?.map(
        (handItem) => handItem.cardId
      );

      if (!porkerHandCardId?.length) {
        continue;
      }

      if (
        porkerHandCardId.includes(cardSprite.getComponent(CommunityCard).cardId)
      ) {
        const communityCardComponent = cardSprite.getComponent(CommunityCard);
        this.moveCardUpwards(communityCardComponent);
      }
    }

    if (winnerIds.includes(this.user.id)) {
      this.coinSpill.play();
    }
  }

  moveCardUpwards(card: PlayerFirstCard | PlayerSecondCard | CommunityCard) {
    const currentPosition = card.node.position;
    const offsetY = 20;

    card.node.position = v3(currentPosition.x, currentPosition.y + offsetY, 0);

    const resetPosition = () => {
      card.node.position = v3(
        currentPosition.x,
        currentPosition.y - offsetY,
        0
      );
    };

    card.border.node.active = true;
    this.scheduleOnce(resetPosition, 5);
  }

  setPlayerCard(
    playerCardPaths: string[],
    playerNode: PlayerPoker,
    isPostionSelfPlayer?: boolean
  ) {
    console.log("setPlayerCard");
    resources.load(
      playerCardPaths,
      SpriteFrame,
      (err: any, spriteFrames: SpriteFrame[]) => {
        if (err) {
          throw err;
        }

        if (!(playerNode.firstCard || playerNode.secondCard)) {
          return;
        }

        playerNode.firstCard.getComponent(UITransform).setContentSize(90, 135);
        playerNode.secondCard.getComponent(UITransform).setContentSize(90, 135);
        if (isPostionSelfPlayer) {
          playerNode.firstCard.node.setPosition(130, -10, 0);
          playerNode.secondCard.node.setPosition(170, -10, 0);
        }
        playerNode.firstCard.spriteFrame = spriteFrames[0];
        playerNode.secondCard.spriteFrame = spriteFrames[1];
      }
    );
  }
}
