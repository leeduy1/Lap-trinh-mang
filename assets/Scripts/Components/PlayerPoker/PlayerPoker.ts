import {
  _decorator,
  Animation,
  Component,
  Label,
  Node,
  Sprite,
  UIOpacity,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerPoker")
export class PlayerPoker extends Component {
  @property(Node)
  public playerPoker: Node;

  @property(Label)
  public username: Label;

  @property(Label)
  public chip: Label;

  @property(Sprite)
  public firstCard: Sprite;

  @property(Sprite)
  public secondCard: Sprite;

  @property(Node)
  public gameAction: Node;

  @property(Node)
  public playerWinnerGame: Node;

  @property(Node)
  public timer: Node;

  public playerId: string;

  showAnimationWinner = () => {
    this.playerWinnerGame.active = true;
    const animationComponent = this.playerWinnerGame.getComponent(Animation);
    if (animationComponent) {
      animationComponent.play();
    }

    this.scheduleOnce(() => {
      this.playerWinnerGame.active = false;
    }, 5);
  };

  blurOutPlayer = () => {
    this.firstCard.getComponent(UIOpacity).opacity = 170;
    this.secondCard.getComponent(UIOpacity).opacity = 170;
    this.scheduleOnce(() => {
      this.firstCard.getComponent(UIOpacity).opacity = 255;
      this.secondCard.getComponent(UIOpacity).opacity = 255;
    }, 5);
  };

  blurPlayer = () => {
    this.playerPoker.getComponent(UIOpacity).opacity = 170;
  };

  resetBlurPlayer = () => {
    this.playerPoker.getComponent(UIOpacity).opacity = 255;
  };
}
