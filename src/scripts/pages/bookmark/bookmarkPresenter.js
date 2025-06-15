import {
  getAllBookmarks,
  removeBookmark,
  isBookmarked
} from "../../../models/bookmarkModel.js";
import Swal from "sweetalert2";

export default class BookmarkPresenter {
  constructor(view) {
    this.view = view;
    this._setupEventListeners();
    this.init();
  }

  async init() {
    const stories = await getAllBookmarks();
    await this.view.render(stories);
  }

    _setupEventListeners() {
    this._boundBodyClickHandler = this._handleBodyClick.bind(this);
    document.body.addEventListener('click', this._boundBodyClickHandler);
  }

  _handleBodyClick(event) {
    const bookmarkSection = document.getElementById('bookmark-section');
    if (!bookmarkSection || !bookmarkSection.contains(event.target)) {
      return;
    }

    const detailButton = event.target.closest(".detail-bookmark-btn");
    if (detailButton) {
      event.preventDefault();
      const story = JSON.parse(detailButton.dataset.story);
      this.handleShowDetail(story);
      return;
    }

    const removeButton = event.target.closest(".remove-bookmark-btn");
    if (removeButton) {
      event.preventDefault();
      const storyId = removeButton.dataset.id;
      this.handleRemoveBookmark(storyId);
    }
  }
  
  destroy() {
    document.body.removeEventListener('click', this._boundBodyClickHandler);
  }

  async handleRemoveBookmark(id) {
    await removeBookmark(id);
    Swal.fire({
      icon: "info",
      title: "Cerita dihapus dari bookmark",
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
    this.init();
  }

  async handleRemoveBookmark(id) {
    await removeBookmark(id);
    Swal.fire({
      icon: "info",
      title: "Cerita dihapus dari bookmark",
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
    this.init();
  }

  async handleShowDetail(story) {
    const bookmarked = await isBookmarked(story.id);
    this.view.showStoryDetailPopup(
      story,
      bookmarked,
      async (closePopup) => {
        const isSaved = await isBookmarked(story.id);
        if (isSaved) {
          await this.handleRemoveBookmark(story.id);
          closePopup();
        }
      }
    );
  }
}