import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("FoldBtn")
export class FoldBtn extends Component {
  @property(Label)
  foldLabel: Label;
}
