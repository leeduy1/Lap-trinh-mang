import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("All_In")
export class All_In extends Component {
  @property(Label)
  allInLabel: Label;
}
