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
import { eventTarget } from "../../Utils/EventTarget";
import { EventNames } from "../../Shared/Enum";

const { ccclass, property } = _decorator;

@ccclass("ToggleButtonMusic")
export class ToggleButtonMusic extends Component {
  @property({ type: Node })
  nodeThumb: Node = null!;

  @property({ type: Sprite })
  Background: Sprite = null!;

  @property({ type: Label })
  label: Label = null!;

  @property({ type: Color })
  bgColor: Color[] = [];

  @property({ type: ToggleButtonMusic })
  toggleButton: ToggleButtonMusic = null!;

  private localStorageMusic = "toggleMusicState";

  onLoad() {
    if (sys.localStorage.getItem(this.localStorageMusic) === "true") {
      this.turnOnMusic();
      this.nodeThumb.setPosition(0 - this.nodeThumb.position.x, 0, 0);
    } else {
      this.turnOffMusic();
      this.nodeThumb.setPosition(this.nodeThumb.position.x, 0, 0);
    }
  }

  setToggleMusic() {
    if (sys.localStorage.getItem(this.localStorageMusic) === "true") {
      this.turnOffMusic();
      sys.localStorage.setItem(this.localStorageMusic, "false");
    } else {
      this.turnOnMusic();
      sys.localStorage.setItem(this.localStorageMusic, "true");
    }
    this.nodeThumb.setPosition(0 - this.nodeThumb.position.x, 0, 0);
    eventTarget.emit(
      EventNames.TOGGLE_MUSIC,
      sys.localStorage.getItem("toggleMusicState") === "true"
    );
  }

  turnOnMusic() {
    this.label.string = "ON";
    this.Background.color = this.bgColor[1];
    this.label.horizontalAlign = HorizontalTextAlignment.LEFT;
    this.nodeThumb.getComponent(Sprite).color = this.bgColor[1];
  }

  turnOffMusic() {
    this.label.string = "OFF";
    this.Background.color = this.bgColor[0];
    this.label.horizontalAlign = HorizontalTextAlignment.RIGHT;
    this.nodeThumb.getComponent(Sprite).color = this.bgColor[0];
  }
}
