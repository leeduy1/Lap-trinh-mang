import { _decorator, Component, Director, director, game, instantiate, macro, Node, Prefab, view } from "cc";
import { NavGameWithBackBtnPrefab } from "../../PrefabScripts/NavGameWithBackBtnPrefab/NavGameWithBackBtnPrefab";
const { ccclass, property } = _decorator;

@ccclass("NavGameWithBackBtn")
export class NavGameWithBackBtn extends Component {

  @property(Prefab)
  NavGameWithBackBtnPrefab: Prefab | null = null;
  
  onLoad() {
    const navgame = instantiate(this.NavGameWithBackBtnPrefab);
    this.node.addChild(navgame);
    navgame.getComponent(NavGameWithBackBtnPrefab).onLoad();
  }

}
