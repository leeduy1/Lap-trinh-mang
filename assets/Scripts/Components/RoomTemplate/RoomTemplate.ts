import { _decorator, Component, Label, Node } from 'cc';
import { Room } from '../../Models/Room';
const { ccclass, property } = _decorator;

@ccclass('RoomTemplate')
export class RoomTemplate extends Component {
    @property(Label)
    public roomKey: Label | null = null;

    @property(Label)
    public roomInfo: Label | null = null;

    init(data: Room) {
        
        this.roomKey.string = `Phòng ${data.key.toString()}`
        this.roomInfo.string = `${data.participants.length} / 9`;
    }
}


