import {
  _decorator,
  CCInteger,
  Component,
  director,
  Label,
  Node,
  UITransform,
} from "cc";
import { setAccessToken } from "../../Utils/Auth";
const { ccclass, property } = _decorator;

@ccclass("Loading")
export class Loading extends Component {
  @property({ type: Node })
  public progressImage: Node | null = null;

  @property({ type: CCInteger })
  public progressMaxLength: number;

  @property({ type: CCInteger })
  public speed: number;

  @property({ type: Label })
  public percent: Label;

  setWidth: number;

  curPercent: number = 0;

  setProgress(pro: number) {
    if (pro > 1 || pro < 0) {
      return;
    }
    this.setWidth = this.progressMaxLength * pro;
  }

  async onLoad() {
    this.progressImage.getComponent(UITransform).width = 420;
    window.parent.postMessage("connected", "http://localhost:3000");
    window.addEventListener("message", async function (event) {
      const { accessToken, refreshToken } = event.data;
      console.log(accessToken);
      setAccessToken(accessToken);
    });
  }

  start() {}

  update(deltaTime: number) {
    if (this.progressImage.getComponent(UITransform).width < this.setWidth) {
      this.progressImage.getComponent(UITransform).width +=
        deltaTime * this.speed;
      this.curPercent = Math.round(
        (this.progressImage.getComponent(UITransform).width / this.setWidth) *
          100
      );
      this.percent.string = String(this.curPercent);
    } else {
      director.loadScene("HomeScene");
    }
  }
}
