import { _decorator, Button, Component, Label, Prefab, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RoomTemplate")
export class RoomTemplate extends Component {
  @property
  public id = "";

  @property(Label)
  public roomName: Label;

  @property(Button)
  public button: Button;

  public init(data: { id: string; name: string }) {
    this.id = data.id;
    this.roomName.string = data.name;

    this.button.node.on(
      "click",
      () => {
        console.log(this.roomName.string);
      },
      this
    );
  }
}
