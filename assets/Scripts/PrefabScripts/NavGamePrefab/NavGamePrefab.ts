import { _decorator, Component, game, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("NavGamePrefab")
export class NavGamePrefab extends Component {
  @property({
    type: Node,
    tooltip: "Full Screen Button",
  })
  public fullScreenButton: Node;

  @property({
    type: Node,
    tooltip: "Setting Button",
  })
  public settingButton: Node;

  onLoad() {
    this.fullScreenButton.on("click", this.onFullScreenBtn, this);
  }

  onFullScreenBtn() {
    if (document.fullscreenEnabled) {
      if (document.fullscreenElement) {
        // Trường hợp đang ở chế độ toàn màn hình
        document.exitFullscreen();
      } else {
        // Trường hợp chưa ở chế độ toàn màn hình
        let canvas = game.canvas;
        canvas.requestFullscreen();
      }
    } else {
      // Không hỗ trợ tính năng full screen web
      console.error("Fullscreen mode is not supported by your browser");
    }
  }
}
