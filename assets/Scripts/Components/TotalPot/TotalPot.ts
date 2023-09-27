import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TotalPot")
export class TotalPot extends Component {
  @property(Label)
  totalPotLabel: Label = null;
}
