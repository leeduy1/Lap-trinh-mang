import {
  _decorator,
  Component,
  AudioSource,
  director,
  sys,
  Director,
} from "cc";
import { eventTarget } from "../../Utils/EventTarget";
import { EventNames } from "../../Shared/Enum";

const { ccclass, property } = _decorator;

@ccclass("Music")
export class Music extends Component {
  @property(AudioSource)
  backgroundMusic: AudioSource = null!;

  private localStorageMusic = "toggleMusicState";
  private localStorageEffect = "toggleEffectState";

  async onLoad() {
    eventTarget.on(EventNames.TOGGLE_MUSIC, this.onToggleMusic, this);
    eventTarget.on(EventNames.CHECK_MUSIC_STATE, this.checkMusicState, this);
    director.addPersistRootNode(this.node);
    if (sys.localStorage.getItem(this.localStorageMusic) === null) {
      sys.localStorage.setItem(this.localStorageMusic, "true");
    }

    if (sys.localStorage.getItem(this.localStorageEffect) === null) {
      sys.localStorage.setItem(this.localStorageEffect, "true");
    }
    this.checkMusicState();
  }

  checkMusicState() {
    director.once(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
      if (sys.localStorage.getItem("toggleMusicState") !== "true") {
        this.backgroundMusic.pause();
      }
    });
  }

  onToggleMusic(isOnToggleMusic: boolean) {
    if (isOnToggleMusic) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.pause();
    }
  }
}
