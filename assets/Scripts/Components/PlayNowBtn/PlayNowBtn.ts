import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayNowBtn')
export class PlayNowBtn extends Component {
    @property(Label)
    playNowLabel: Label;
}


