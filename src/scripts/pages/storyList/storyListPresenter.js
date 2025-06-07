import Api from "../../data/api.js";
import { getLocationName } from "../../data/locationModel.js";

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
    } catch (err) {
      console.error("Gagal memuat daftar cerita:", err);
      this.view.showAlert("Gagal", "Gagal memuat cerita.", "error");
    }
  }
}
