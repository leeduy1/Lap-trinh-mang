import { _decorator, Component, Label, Node, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LobbyItem")
export class LobbyItem extends Component {
  @property(Label)
  public betLabel: Label;

  @property(Sprite)
  public lobbySprite: Sprite = null;
}
