import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NumPageButton')
export class NumPageButton extends Component {
    @property(Label)
    numPageLabel: Label = null;

    @property(Sprite)
    background: Sprite = null;

    public isActive = false;
}


