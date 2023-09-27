import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { UserProfile } from '../UserProfile/UserProfile';
const { ccclass, property } = _decorator;

@ccclass('Profile')
export class Profile extends Component {
    @property(Prefab)
    profilePrefab: Prefab | null = null;

    onLoad() {
        const profile = instantiate(this.profilePrefab);
        this.node.addChild(profile);
        profile.getComponent(UserProfile).onLoad();
    }
}


