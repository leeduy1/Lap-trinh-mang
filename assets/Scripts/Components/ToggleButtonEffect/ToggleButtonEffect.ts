import {
  _decorator,
  Component,
  sys,
  Node,
  Sprite,
  Label,
  Color,
  HorizontalTextAlignment,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("ToggleButtonEffect")
export class ToggleButtonEffect extends Component {
  @property({ type: Node })
  nodeThumb: Node = null!;

  @property({ type: Sprite })
  Background: Sprite = null!;

  @property({ type: Label })
  label: Label = null!;

  @property({ type: Color })
  bgColor: Color[] = [];

  private localStorageEffect = "toggleEffectState";

  onLoad() {
    if (sys.localStorage.getItem(this.localStorageEffect) === "true") {
      this.turnOnEffect();
      this.nodeThumb.setPosition(0 - this.nodeThumb.position.x, 0, 0);
    } else {
      this.turnOffEffect();
      this.nodeThumb.setPosition(this.nodeThumb.position.x, 0, 0);
    }
  }

  setToggleEffect() {
    if (sys.localStorage.getItem(this.localStorageEffect) === "true") {
      this.turnOffEffect();
      sys.localStorage.setItem(this.localStorageEffect, "false");
    } else {
      this.turnOnEffect();
      sys.localStorage.setItem(this.localStorageEffect, "true");
    }
    this.nodeThumb.setPosition(0 - this.nodeThumb.position.x, 0, 0);
  }

  turnOnEffect() {
    this.label.string = "ON";
    this.Background.color = this.bgColor[1];
    this.label.horizontalAlign = HorizontalTextAlignment.LEFT;
    this.nodeThumb.getComponent(Sprite).color = this.bgColor[1];
  }

  turnOffEffect() {
    this.label.string = "OFF";
    this.Background.color = this.bgColor[0];
    this.label.horizontalAlign = HorizontalTextAlignment.RIGHT;
    this.nodeThumb.getComponent(Sprite).color = this.bgColor[0];
  }
}
