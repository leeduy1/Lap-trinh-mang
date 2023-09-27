import { _decorator, Component, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerFirstCard")
export class PlayerFirstCard extends Component {
  @property(Sprite)
  public border: Sprite;

  public cardId: string;
}
