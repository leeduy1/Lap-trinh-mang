import { _decorator, Component, Director, director, game, instantiate, macro, Node, Prefab, view } from "cc";
import { NavGamePrefab } from "../../PrefabScripts/NavGamePrefab/NavGamePrefab";
const { ccclass, property } = _decorator;

@ccclass("NavGame")
export class NavGame extends Component {

  @property(Prefab)
    NavGamePrefab: Prefab | null = null;
  
  onLoad() {
    const navgame = instantiate(this.NavGamePrefab);
    this.node.addChild(navgame);
    navgame.getComponent(NavGamePrefab).onLoad();
  }

}
