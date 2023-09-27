import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ModalBet')
export class ModalBet extends Component {
    @property({
        type: ProgressBar,
        tooltip: 'Process Bar'
    }) public progressBar: ProgressBar;

    onLoad() {
        this.progressBar.node.on('slide', this.onProgressBarChanged, this); // Đăng ký sự kiện khi người dùng kéo thanh trượt
    }

    onProgressBarChanged(event) {
        this.progressBar.progress = event.detail.progress; // Cập nhật giá trị của ProgressBar
    }
}


