import { _decorator, Component, Animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SettingPopup")
export class SettingPopup extends Component {
  private animation: Animation = null;
  private isShow: boolean = false;

  onLoad() {
    this.node.active = false;
    this.animation = this.node.getComponent(Animation);
  }

  togglePopup() {
    if (this.isShow) {
      this.isShow = false;
      this.node.active = false;
    } else {
      this.isShow = true;
      this.node.active = true;
    }
  }
}
