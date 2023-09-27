import { _decorator, Button, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ConfirmPopup")
export class ConfirmPopup extends Component {
  @property({
    type: Button,
  })
  public acceptButton: Button;

  @property({
    type: Button,
  })
  public cancelButton: Button;

  protected onLoad(): void {
    this.cancelButton.node.on("click", this.onCancel, this);
  }

  onCancel() {
    this.node.active = false;
  }
}
