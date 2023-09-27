import {
  _decorator,
  Component,
  instantiate,
  Node,
  UITransform,
  ScrollView,
  Vec3,
  v2,
  Size,
  Prefab,
  resources,
  SpriteFrame,
  Sprite,
  director,
  sys,
} from "cc";
import { Rooms } from "../Rooms/Rooms";
import { fakeData } from "../Rooms/fakeData";
import { PaginationButtons } from '../PaginationButtons/PaginationButtons';
import { NumPageButton } from '../NumPageButton/NumPageButton';
import { eventTarget } from "../../Utils/EventTarget";
import { getRoomsInLobby } from "../../Services/Lobby";
import { Room } from "../../Models/Room";
const { ccclass, property } = _decorator;

@ccclass("SlideShowRooms")
export class SlideShowRooms extends Component {
  @property(Prefab)
  rooms: Prefab  = null;

  @property(ScrollView)
  scrollView: ScrollView;

  @property(Node)
  container: Node = null;

  @property(PaginationButtons)
  paginationButtons: PaginationButtons = null;

  private currentOffsetX: number = 0;
  private stepOffsetX: number = 1400;
  private widthContent: number = 1400;
  private allowScroll: boolean = false;
  private itemsPerPage = 18;
  private numPageActiveIndex = 0;
  private pages: Rooms[] = [];
  private roomsInLobby: Room[] = [];

  private readonly directorButtonActiveUrl =
  "PaginationButton/pagination-btn-active/spriteFrame";
private readonly directorButtonRegularUrl =
  "PaginationButton/pagination-btn-regular/spriteFrame";
private readonly numPageButtonActiveUrl =
  "PaginationButton/border-active/spriteFrame";
private readonly numPageButtonRegularUrl =
  "PaginationButton/border-regular/spriteFrame";

  async onLoad() {
    await this.init();
    this.paginationButtons.nextButton.node.on("click", this.moveToNext, this);
    this.paginationButtons.previousButton.node.on("click", this.moveToPrevious, this);
    eventTarget.on("numberPagination", this.handleNumberPagination, this);
  }

  handleNumberPagination(data: number) {
    const numberActive = data - 1;  
    const buttonActive = this.paginationButtons.numPageButtonsInstance.numPageButtons[numberActive];  
    this.currentOffsetX = this.widthContent * numberActive;  
    this.scrollView.scrollToOffset(v2(this.currentOffsetX, 0), 0.3);
    this.changeNumPageActive(numberActive, buttonActive);
  }

  moveToNext() {
    this.allowScroll = true;
    this.currentOffsetX += this.stepOffsetX;
  
    const maxOffsetX = this.widthContent * this.pages.length - this.widthContent;
    if (this.currentOffsetX > maxOffsetX) {
      this.currentOffsetX = maxOffsetX;
    }
  
    this.scrollView.scrollToOffset(v2(this.currentOffsetX, 0), 0.3);
    this.scheduleOnce(() => {
      this.allowScroll = false;
    }, 0.5);

    this.setButtonInActive(
      this.directorButtonRegularUrl,
      this.paginationButtons.previousButton.background
    );
    this.setButtonActive(
      this.directorButtonActiveUrl,
      this.paginationButtons.nextButton.background
    );
    const nextButtonActiveIndex =
      this.numPageActiveIndex + 1 >=
      this.paginationButtons.numPageButtonsInstance.numPageButtons.length
        ? this.numPageActiveIndex
        : this.numPageActiveIndex + 1;
    const nextButtonActive =
      this.paginationButtons.numPageButtonsInstance.numPageButtons[nextButtonActiveIndex];
    this.changeNumPageActive(nextButtonActiveIndex, nextButtonActive);
  }

  moveToPrevious() {
    this.allowScroll = true;
    this.currentOffsetX -= this.stepOffsetX;
  
    if (this.currentOffsetX < 0) {
      this.currentOffsetX = 0;
    }
  
    this.scrollView.scrollToOffset(v2(this.currentOffsetX, 0), 0.3);
    this.scheduleOnce(() => {
      this.allowScroll = false;
    }, 0.5);
    this.setButtonInActive(
      this.directorButtonRegularUrl,
      this.paginationButtons.nextButton.background
    );
    this.setButtonActive(
      this.directorButtonActiveUrl,
      this.paginationButtons.previousButton.background
    );
    const previousButtonActiveIndex =
      this.numPageActiveIndex - 1 <= 0 ? 0 : this.numPageActiveIndex - 1;
    const previousButtonActive =
      this.paginationButtons.numPageButtonsInstance.numPageButtons[previousButtonActiveIndex];
    this.changeNumPageActive(previousButtonActiveIndex, previousButtonActive);
  }

  async init() {
    const content = this.scrollView.content;
    const stepOnPage = this.widthContent;
    const informationLobby = JSON.parse(sys.localStorage.getItem('information-lobby'));
    const res = await getRoomsInLobby(informationLobby.lobbyId);
    this.roomsInLobby = res.data;
    eventTarget.emit('ROOMS_IN_LOBBY', this.roomsInLobby);
    const numberOfPages = Math.ceil(this.roomsInLobby.length / this.itemsPerPage);
    

    for (let i = 0; i < numberOfPages; i++) {
      const pageNode = instantiate(this.rooms);
      const page = pageNode.getComponent(Rooms);
      const paginatedArray = this.paginateArray(i * this.itemsPerPage, this.itemsPerPage);
      page.renderRooms(paginatedArray);
      const positionX = (stepOnPage * i);
      pageNode.setPosition(new Vec3(positionX, 0, 0));
      content.addChild(pageNode);
      this.pages.push(page);
    }

    const childs = content.children;
    const totalWidth = this.widthContent * (childs.length);
    const contentUITransform = content.getComponent(UITransform);
    contentUITransform.contentSize = new Size(
      totalWidth,
      contentUITransform.contentSize.height
    );

    this.currentOffsetX = 0;
    this.scrollView.scrollToOffset(v2(this.currentOffsetX, 0), 0);
  }

  paginateArray(startIndex: number, itemsPerPage: number) {    
    const pageItems = this.roomsInLobby.slice(startIndex, startIndex + itemsPerPage);
    return pageItems;
  }

  changeNumPageActive(indexActive: number, buttonActive: NumPageButton) {
    const currentButtonActive =
      this.paginationButtons.numPageButtonsInstance.numPageButtons[this.numPageActiveIndex];
    this.setButtonInActive(
      this.numPageButtonRegularUrl,
      currentButtonActive.background
    );
    this.setButtonActive(this.numPageButtonActiveUrl, buttonActive.background);
    this.numPageActiveIndex = indexActive;
  }

  setButtonActive(url: string, background: Sprite) {
    this.loadSpriteFrame(url, background);
  }

  setButtonInActive(url: string, background: Sprite) {
    this.loadSpriteFrame(url, background);
  }

  loadSpriteFrame(url: string, background: Sprite) {
    resources.load(url, SpriteFrame, (err: any, spriteFrame) => {
      if (err) throw err;
      background.spriteFrame = spriteFrame;
    });
  }
}


