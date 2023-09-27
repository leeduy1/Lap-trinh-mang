import { _decorator, Component, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CommunityCard")
export class CommunityCard extends Component {
  @property(Sprite)
  public border: Sprite;

  public cardId: string;
}
