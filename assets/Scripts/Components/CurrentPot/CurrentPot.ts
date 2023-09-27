import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CurrentPot")
export class CurrentPot extends Component {
  @property(Label)
  currentPotLabel: Label = null;
}
