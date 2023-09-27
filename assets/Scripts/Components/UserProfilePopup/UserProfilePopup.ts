import { _decorator, Component, Animation, Vec3, tween } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UserProfilePopup")
export class UserProfilePopup extends Component {
  private animation: Animation;

  onLoad() {
    this.node.active = false;
    this.animation = this.node.getComponent(Animation);
  }

  showPopup() {
    if (!this.node.active) {
      this.node.active = true;
      this.animation.play("zoomIn");
    }
  }

  hidePopup() {
    this.scheduleOnce(() => {
      this.node.active = false;
    }, 12 / 60);
    this.animation.play("zoomOut");
  }
}
