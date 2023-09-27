import { _decorator, Component, ImageAsset, Label, Node, Sprite, SpriteFrame, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PaginationButton")
export class PaginationButton extends Component {
  @property(Label)
  numPageLabel: Label = null;

  @property(Sprite)
  bgButton: Sprite = null;

  @property(Sprite)
  iconButton: Sprite = null;

  public isDirectionButton: boolean = false;

  public directionType: string;

  public isSelected: boolean = false;
}
