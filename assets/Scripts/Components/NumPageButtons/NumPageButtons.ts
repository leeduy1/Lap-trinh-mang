import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  resources,
  SpriteFrame,
} from "cc";
import { NumPageButton } from "../NumPageButton/NumPageButton";
import { eventTarget } from "../../Utils/EventTarget";
const { ccclass, property } = _decorator;

@ccclass("NumPageButtons")
export class NumPageButtons extends Component {
  @property(Prefab)
  numPagePrefab: Prefab = null;

  numPageButtons: NumPageButton[] = [];

  renderNumPageButtons(quantityButtons: number) {
    for (let i = 1; i <= quantityButtons; ++i) {
      const numPagePrefab = instantiate(this.numPagePrefab);
      const numPageButton = numPagePrefab.getComponent(NumPageButton);
      numPageButton.numPageLabel.string = i.toString();

      numPageButton.node.on(Node.EventType.MOUSE_DOWN, this.onNumPageButtonClicked, this);

      if (i === 1) {
        resources.load(
          "PaginationButton/border-active/spriteFrame",
          SpriteFrame,
          (err: any, spriteFrame) => {
            if (err) throw err;
            numPageButton.background.spriteFrame = spriteFrame;
          }
        );
      }
      this.node.addChild(numPagePrefab);
      this.numPageButtons.push(numPageButton);
    }
  }

  onNumPageButtonClicked(event) {
    const clickedButton = event.currentTarget.getComponent(NumPageButton);
    eventTarget.emit('numberPagination', clickedButton.numPageLabel.string)
  }
  
}
