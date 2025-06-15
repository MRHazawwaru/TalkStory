import Api from "../../data/api.js";
import { getLocationName } from "../../data/locationModel.js";
import {
  addBookmark,
  removeBookmark,
  isBookmarked
} from "../../../models/bookmarkModel.js";
import Swal from "sweetalert2";

export default class StoryListPresenter {
  constructor(view) {
    this.view = view;
    this.init();
  }

  async init() {
    await this.view.render();
    await this.loadStories();
  }

  async loadStories() {
    try {
      const token = localStorage.getItem("token");
      const response = await Api.getStories(token);

      const enrichedStories = await Promise.all(
        response.listStory.map(async (story) => {
          const locationName =
            story.lat && story.lon
              ? await getLocationName(story.lat, story.lon)
              : "Tanpa Lokasi";

          return {
            ...story,
            locationName,
          };
        })
      );

      this.view.showStories(enrichedStories);
      this.view.bindDetailButtons(async (story) => {
        const bookmarked = await isBookmarked(story.id);

        this.view.showStoryDetailPopup(
          story,
          bookmarked,
          async () => {
            const isSaved = await isBookmarked(story.id);
            if (isSaved) {
              await removeBookmark(story.id);
              this.view.updateBookmarkButton(false);
              Swal.fire({
                icon: "info",
                title: "Cerita dihapus dari bookmark",
                toast: true,
                position: "top-end",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              await addBookmark(story);
              this.view.updateBookmarkButton(true);
              Swal.fire({
                icon: "success",
                title: "Cerita disimpan ke bookmark",
                toast: true,
                position: "top-end",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          }
        );
      });
    } catch (err) {
      console.error("Gagal memuat daftar cerita:", err);
      this.view.showAlert("Gagal", "Gagal memuat cerita.", "error");
    }
  }
}
