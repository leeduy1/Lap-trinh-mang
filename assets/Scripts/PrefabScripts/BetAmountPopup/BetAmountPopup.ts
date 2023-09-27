import {
  _decorator,
  Component,
  Node,
  Slider,
  Sprite,
  Label,
  Button,
  sys,
} from "cc";
import { Socket } from "socket.io-client";
import SocketClient from "../../Utils/Socket";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { EGameAction } from "../../Interfaces";
const { ccclass, property } = _decorator;

@ccclass("BetAmountPopup")
export class BetAmountPopup extends Component {
  @property({
    type: Slider,
  })
  public slider: Slider;

  @property({
    type: Node,
  })
  public bgSlider: Node;

  @property({
    type: Label,
  })
  public minBetAmount: Label;

  @property({
    type: Label,
  })
  public maxBetAmount: Label;

  @property({
    type: Label,
  })
  public currentBetAmount: Label;

  @property({
    type: Button,
  })
  public callBtn: Button;

  @property({
    type: Button,
  })
  public callMaxBtn: Button;

  socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  roomId: string;

  onLoad() {
    this.socket = SocketClient.getClient();
    this.roomId = sys.localStorage.getItem("room");

    this.slider.node.on("slide", this.onSliderValueChanged, this);
    this.callBtn.node.on("click", this.handleRaise, this);
    this.callMaxBtn.node.on("click", this.onCallMaxClicked, this);
  }

  setBetAmountRange(minBet: string, maxBet: string, currentBet: string) {
    this.minBetAmount.string = minBet;
    this.maxBetAmount.string = maxBet;
    this.currentBetAmount.string = currentBet;
  }

  roundToNearest(value: number, roundTo: number): number {
    return Math.round(value / roundTo) * roundTo;
  }

  onSliderValueChanged() {
    const sliderValue = this.slider.progress;

    // Cập nhật fillRange của bgSlider dựa trên giá trị của slider
    this.bgSlider.getComponent(Sprite).fillRange = sliderValue;

    // Lấy giá trị min và max bet từ slider
    const minBet = parseInt(this.minBetAmount.string);
    const maxBet = parseInt(this.maxBetAmount.string);

    // Tính toán giá trị current bet dựa trên giá trị min, max và progress
    const currentBet =
      minBet + this.roundToNearest((maxBet - minBet) * sliderValue, 1);

    // Cập nhật giá trị current bet lên nhãn
    this.currentBetAmount.string = currentBet.toString();
  }

  onCallMaxClicked() {
    const maxBet = parseInt(this.maxBetAmount.string);
    this.currentBetAmount.string = maxBet.toString();
    this.slider.progress = 1;
    this.bgSlider.getComponent(Sprite).fillRange = 1;
    this.handleAllIn();
  }

  handleRaise() {
    this.socket.emit(EGameAction.RAISE, {
      roomId: this.roomId,
      amount: this.currentBetAmount.string,
    });
  }

  handleAllIn() {
    this.socket.emit(EGameAction.ALL_IN, { roomId: this.roomId });
  }

  resetBetPopup() {
    this.slider.progress = 0;
    this.bgSlider.getComponent(Sprite).fillRange = 0;
    this.currentBetAmount.string = "0";
  }
}
