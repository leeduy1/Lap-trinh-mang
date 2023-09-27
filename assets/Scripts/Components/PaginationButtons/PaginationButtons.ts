import {
  _decorator,
  Component,
  Node
} from "cc";
import { NumPageButtons } from "../NumPageButtons/NumPageButtons";
import { NextButton } from "../NextButton/NextButton";
import { PreviousButton } from "../PreviousButton/PreviousButton";
import { eventTarget } from "../../Utils/EventTarget";
const { ccclass, property } = _decorator;

@ccclass("PaginationButtons")
export class PaginationButtons extends Component {
  @property(Node)
  container: Node = null;

  @property(NumPageButtons)
  numPageButtonsInstance: NumPageButtons = null;

  @property(NextButton)
  nextButton: NextButton = null;

  @property(PreviousButton)
  previousButton: PreviousButton = null;

  private itemsPerPage = 18;

  async onLoad() {
    eventTarget.on('ROOMS_IN_LOBBY', (roomsInLobby) => {
      console.log('roomsInLobby: ', roomsInLobby);
      const totalPages = Math.ceil(roomsInLobby.length / this.itemsPerPage);
      console.log(totalPages);
      
      this.numPageButtonsInstance.renderNumPageButtons(totalPages);
    });
   
  }
}
