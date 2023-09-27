import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CheckBtn")
export class CheckBtn extends Component {
  @property(Label)
  checkLabel: Label;
}
