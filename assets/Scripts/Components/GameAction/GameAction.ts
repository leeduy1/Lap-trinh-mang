import { _decorator, Button, Component, Node, sys } from "cc";
import { Participant } from "../../Models/Participant";
import { BetAmountPopup } from "../../PrefabScripts/BetAmountPopup/BetAmountPopup";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import SocketClient from "../../Utils/Socket";
import { EGameAction } from "../../Interfaces/GameAction";
import { CheckBtn } from "../CheckBtn/CheckBtn";

const { ccclass, property } = _decorator;

@ccclass("GameAction")
export class GameAction extends Component {
  @property(Node)
  public betAmountPopup: Node;

  @property(Button)
  public foldBtn: Button;

  @property(Button)
  public checkBtn: Button;

  @property(Button)
  public raiseBtn: Button;

  @property(Button)
  public allInBtn: Button;

  public players: Participant[] = [];

  public playerNodeId: string;

  socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  roomId: string;

  protected onLoad(): void {
    this.socket = SocketClient.getClient();
    this.roomId = sys.localStorage.getItem("room");

    this.foldBtn.node.on("click", this.handleFold, this);
    this.checkBtn.node.on("click", this.handleCheckOrCall, this);
    this.raiseBtn.node.on("click", this.isShowPopupBetAmount, this);
    this.allInBtn.node.on("click", this.handleAllIn, this);
  }

  isShowPopupBetAmount() {
    const popup: BetAmountPopup =
      this.betAmountPopup.getComponent(BetAmountPopup);
    const selfPlayer = this.players.find(
      (player) => player.userId === this.playerNodeId
    );
    const maxEntranceFee = selfPlayer.totalChip;
    popup.setBetAmountRange("0", maxEntranceFee, popup.currentBetAmount.string);
    this.betAmountPopup.active = !this.betAmountPopup.active;
  }

  handleFold() {
    this.socket.emit(EGameAction.FOLD, { roomId: this.roomId });
    this.hideActionButton();
  }

  handleCheckOrCall() {
    const label = this.checkBtn.getComponent(CheckBtn).checkLabel.string;

    if (label === EGameAction.CHECK) {
      this.socket.emit(EGameAction.CHECK, { roomId: this.roomId });
    } else {
      this.socket.emit(EGameAction.CALL, { roomId: this.roomId });
    }

    this.hideActionButton();
  }

  handleAllIn() {
    this.socket.emit(EGameAction.ALL_IN, { roomId: this.roomId });
    this.hideActionButton();
  }

  hideActionButton() {
    this.betAmountPopup.active = false;
    this.foldBtn.node.active = false;
    this.checkBtn.node.active = false;
    this.allInBtn.node.active = false;
    this.raiseBtn.node.active = false;
  }
}
