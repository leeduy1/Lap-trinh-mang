import { _decorator, Component, Label } from "cc";
import { getProfile } from "../../Utils/Auth";
import BigNumber from "bignumber.js";

import {
  formatCoin,
  formatCoinWithDotSeparators,
} from "../../Utils/CoinFormatting";
const { ccclass, property } = _decorator;

@ccclass("UserProfile")
export class UserProfile extends Component {
  @property({
    type: Label,
    tooltip: "Username",
  })
  public usernameLabel: Label;

  @property({
    type: Label,
  })
  public goldenBalanceLabel: Label;

  @property({
    type: Label,
  })
  public silverBalanceLabel: Label;

  @property({
    type: Label,
  })
  public popupUsername: Label;

  @property({
    type: Label,
  })
  public popupGoldenBalance: Label;

  @property({
    type: Label,
  })
  public popupSilverBalance: Label;

  onLoad() {
    const { username, wallet } = getProfile();
    const { silverChip, goldenChip } = wallet;

    const goldenCoin = new BigNumber(goldenChip);
    const silverCoin = new BigNumber(silverChip);

    this.usernameLabel.string = username;
    this.goldenBalanceLabel.string = formatCoin(goldenCoin);
    this.silverBalanceLabel.string = formatCoin(silverCoin);

    this.popupUsername.string = username;
    this.popupGoldenBalance.string = formatCoinWithDotSeparators(goldenCoin);
    this.popupSilverBalance.string = formatCoinWithDotSeparators(silverCoin);
  }
}
