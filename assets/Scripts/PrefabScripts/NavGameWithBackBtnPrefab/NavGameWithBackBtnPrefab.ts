import { _decorator, Component, director, game, Node } from "cc";
import { eventTarget } from "../../Utils/EventTarget";
import { EventNames } from "../../Shared/Enum";
const { ccclass, property } = _decorator;

@ccclass("NavGameWithBackBtnPrefab")
export class NavGameWithBackBtnPrefab extends Component {
  @property({
    type: Node,
    tooltip: "Back Button",
  })
  public backButton: Node;

  @property({
    type: Node,
    tooltip: "Confirm exit popup",
  })
  public confirmPopup: Node;

  onLoad() {
    if (this.confirmPopup) {
      this.confirmPopup.active = false;
      this.backButton.on("click", this.toggleBackBtn, this);
    } else {
      this.backButton.on("click", this.onBack, this);
    }
  }

  toggleBackBtn() {
    this.confirmPopup.active = !this.confirmPopup.active;
  }

  onBack() {
    director.loadScene("HomeScene");
    eventTarget.emit(EventNames.CHECK_MUSIC_STATE);
  }
}
