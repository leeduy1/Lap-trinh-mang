import { _decorator, Component, AudioSource, sys } from "cc";
import { setProfile } from "../../Utils/Auth";
import { getUserProfile, loginUser } from "../../Services/User";

const { ccclass } = _decorator;

@ccclass("Home")
export class Home extends Component {
  async onLoad() {
    // await loginUser();
    const response = await getUserProfile();

    setProfile(response);
  }
}
