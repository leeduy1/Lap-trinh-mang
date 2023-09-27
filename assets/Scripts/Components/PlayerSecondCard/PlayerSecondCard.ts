import { _decorator, Component, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerSecondCard")
export class PlayerSecondCard extends Component {
  @property(Sprite)
  public border: Sprite;

  cardId: string;
}
