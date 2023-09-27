import { _decorator, Component, Node, director } from "cc";
import { eventTarget } from "../../Utils/EventTarget";
import { EventNames } from "../../Shared/Enum";
const { ccclass, property } = _decorator;

@ccclass("ListGame")
export class ListGame extends Component {
  @property({
    type: Node,
  })
  public pokerNode: Node;

  @property({
    type: Node,
  })
  public taiXiuNode: Node;

  onLoad() {
    this.pokerNode.on(Node.EventType.TOUCH_END, this.onPokerNodeClicked, this);
    this.taiXiuNode.on(
      Node.EventType.TOUCH_END,
      this.onTaiXiuNodeClicked,
      this
    );
  }

  onPokerNodeClicked() {
    director.loadScene("LobbyScene");
    eventTarget.emit(EventNames.CHECK_MUSIC_STATE);
  }

  onTaiXiuNodeClicked() {}
}
