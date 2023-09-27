import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NextButton')
export class NextButton extends Component {
    @property(Sprite)
    background: Sprite = null;

    public isActive: boolean = false;
}


