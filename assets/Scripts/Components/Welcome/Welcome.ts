import {
  _decorator,
  CCInteger,
  Component,
  instantiate,
  Node,
  Prefab,
} from "cc";
import { Loading } from "../Loading/Loading";
const { ccclass, property } = _decorator;

@ccclass("welcome")
export class welcome extends Component {
  @property({ type: Node })
  public background: Node | null = null;

  @property({ type: Prefab })
  public loadingPrefab: Prefab | null = null;

  onLoad() {
    let m_Loading: Node | null = null;
    m_Loading = instantiate(this.loadingPrefab);
    this.background.addChild(m_Loading);
    m_Loading.position.set(0, -290, 0);
    m_Loading.getComponent(Loading).setProgress(1);
  }
}
