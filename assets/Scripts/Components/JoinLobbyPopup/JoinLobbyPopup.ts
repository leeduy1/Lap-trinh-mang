import {
  _decorator,
  Component,
  director,
  EditBox,
  Label,
  sys,
  tween,
  Vec3,
} from "cc";
import SocketClient from "../../Utils/Socket";
import {
  EEventSocket,
  IInformationJoinLobby,
} from "../../Interfaces";
import BigNumber from "bignumber.js";

const { ccclass, property } = _decorator;

@ccclass("JoinLobbyPopup")
export class JoinLobbyPopup extends Component {
  lobbyId: string;
  userId: string;
  totalChip: string;
  lobbyName: string;

  @property(Label)
  public placeholder: Label;

  @property(EditBox)
  public editBox: EditBox;

  @property(Label)
  public errorLabel: Label;

  onLoad() {
    this.errorLabel.string = "";
  }

  showWindow(data: IInformationJoinLobby) {
    this.lobbyId = data.lobbyId;
    this.userId = data.userId;
    this.lobbyName = data.lobbyName;
    const minEntranceFee = new BigNumber(data.bigBlind).multipliedBy(100);
    const maxEntranceFee = new BigNumber(data.bigBlind).multipliedBy(200);
    this.placeholder.string = `${minEntranceFee.toString()} - ${maxEntranceFee.toString()}`;
    this.node.active = true;
    this.node.setScale(new Vec3(0, 0));

    tween(this.node)
      .to(0.5, { scale: new Vec3(1, 1, 100) }, { easing: "quartInOut" })
      .start();
  }

  hideWindow() {
    this.errorLabel.string = "";
    tween(this.node)
      .to(0.5, { scale: new Vec3(0, 0) }, { easing: "quartInOut" })
      .call(() => {
        this.node.active = false;
      })
      .start();
  }

  async onJoinButtonClicked() {
    const socket = SocketClient.getClient();
    if (this.totalChip === "") {
      return (this.errorLabel.string = "Vui lòng nhập đúng số tiền quy định");
    }

    socket.on(EEventSocket.ERROR, (data) => {
      if (data.message === "not_enough_chips") {
        this.editBox.string = "";
        this.totalChip = "";
        return (this.errorLabel.string = "Số tiền của bạn không đủ");
      }
    });
    const informationLobby = {
      totalChip: this.totalChip,
      userId: this.userId,
      lobbyId: this.lobbyId
    }
    sys.localStorage.setItem('information-lobby', JSON.stringify(informationLobby));
    this.hideWindow();
    director.loadScene("ListRoomScene");

  }

  onCancelButtonClicked() {
    this.editBox.string = "";
    this.hideWindow();
  }

  editBoxTextChanged(text: string) {
    const entranceFeeRange = this.placeholder.string.split(" - ");
    const minEntranceFee = new BigNumber(entranceFeeRange[0]);
    const maxEntranceFee = new BigNumber(entranceFeeRange[1]);
    const value = new BigNumber(text);

    if (
      value.isNaN() ||
      value.isLessThan(minEntranceFee) ||
      value.isGreaterThan(maxEntranceFee)
    ) {
      this.editBox.string = "";
      this.totalChip = "";
    } else {
      this.totalChip = text;
    }
    this.errorLabel.string = "";
  }
}
