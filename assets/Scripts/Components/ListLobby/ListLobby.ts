import {
  Component,
  EventTouch,
  ImageAsset,
  Node,
  Prefab,
  SpriteFrame,
  UITransform,
  _decorator,
  assetManager,
  instantiate,
} from "cc";
import { Lobby } from "../../Models/Lobby";
import { getLobby } from "../../Services/Lobby";
import { getProfile } from "../../Utils/Auth";
import { JoinLobbyPopup } from "../JoinLobbyPopup/JoinLobbyPopup";
import { LobbyItem } from "../LobbyItem/LobbyItem";
import { IInformationJoinLobby } from "../../Interfaces";

const { ccclass, property } = _decorator;

@ccclass("ListLobby")
export class ListLobby extends Component {
  @property(Node)
  listLobby: Node = null;

  @property(Node)
  popupJoin: Node = null;

  @property(Prefab)
  lobbyPrefab: Prefab = null;

  async onLoad() {
    const res = await getLobby();
    await this.createLobby(res.data);
  }

  async createLobby(data: Lobby) {
    this.listLobby.removeAllChildren();

    const lobbyData = data.result;
    const itemsPerRow = 4;
    const lobbySpacingX = 180;
    const lobbySpacingY = 305;

    let currentX = -275;
    let currentY = 95;

    for (let index = 0; index < lobbyData.length; index++) {
      if (index === itemsPerRow) {
        currentX = -275;
        currentY -= lobbySpacingY;
      }

      const lobbyDataItem = lobbyData[index];
      const lobbyNode: Node = instantiate(this.lobbyPrefab);
      const lobbyItem: LobbyItem = lobbyNode.getComponent(LobbyItem);

      await this.loadLobbyImage(lobbyItem, lobbyDataItem.image);
      this.setBetLabel(
        lobbyItem,
        lobbyDataItem.smallBlind,
        lobbyDataItem.bigBlind
      );
      lobbyNode.setPosition(currentX, currentY);
      const user = getProfile();
      lobbyNode.on(
        "click",
        (event: EventTouch) => {
          this.onClickLobby({
            lobbyId: lobbyDataItem.id,
            userId: user.id,
            smallBlind: lobbyDataItem.smallBlind,
            bigBlind: lobbyDataItem.bigBlind,
            lobbyName: lobbyDataItem.name,
          });
        },
        this
      );
      this.listLobby.addChild(lobbyNode);

      currentX += lobbySpacingX;
    }
  }

  onClickLobby(data: IInformationJoinLobby) {
    const component = this.popupJoin.getComponent(JoinLobbyPopup);
    component.showWindow(data);
  }

  async loadLobbyImage(lobbyItem: LobbyItem, imageName: string) {
    const url = `https://garena-api.xfsteam.net/uploads/${imageName}`;
    const imageAsset: ImageAsset = await this.loadImageAsset(url);
    const spriteFrame: SpriteFrame = SpriteFrame.createWithImage(imageAsset);

    lobbyItem.lobbySprite.spriteFrame = spriteFrame;

    const lobbySpriteTransform: UITransform =
      lobbyItem.lobbySprite.getComponent(UITransform);
    lobbySpriteTransform.setContentSize(175, 231);
  }

  setBetLabel(lobbyItem: LobbyItem, smallBlind: string, bigBlind: string) {
    const betLabel = lobbyItem.betLabel;
    betLabel.string = `Cược: ${smallBlind}/${bigBlind}`;
  }

  async loadImageAsset(url: string): Promise<ImageAsset> {
    return new Promise<ImageAsset>((resolve, reject) => {
      assetManager.loadRemote(url, (err, imageAsset: ImageAsset) => {
        if (err) {
          reject(err);
        } else {
          resolve(imageAsset);
        }
      });
    });
  }
}
