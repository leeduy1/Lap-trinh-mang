import { _decorator, Component, ImageAsset, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CursorCustom')
export class CursorCustom extends Component {
    @property(ImageAsset)
    private cursorImage : ImageAsset = null;

    // start () {
    //     resources.load(this.cursorImage.nativeUrl, ImageAsset, (err, img) => {
    //         if (err) {
    //             console.error(err);
    //         } else {
    //             const canvas = document.getElementById("GameCanvas");
    //             canvas.style.cursor = `url("${img.nativeUrl}"), auto`;
    //         }
    //     });
    // }
}