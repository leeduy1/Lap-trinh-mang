import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RaiseBtn")
export class RaiseBtn extends Component {
  @property(Label)
  raiseLabel: Label;
}
