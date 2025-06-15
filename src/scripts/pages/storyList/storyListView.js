import renderWithTransition from "../../utils/transitionHelper";
import bindSkipToContent from "../../utils/skip";
import { createMap, addMarker } from "../../utils/map";

export default class StoryListView {
  constructor() {}

  async render() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) {
    console.error("❌ #main-content tidak ditemukan saat render story list");
    return;
  }
    const html = `
        <section class="story-list-section">
          <h2>Daftar Cerita</h2>
          <div class="container-card" id="story-container"></div>
        </section>
    `;
    await renderWithTransition(mainContent, html);
    bindSkipToContent();
  }

  async showStories(stories) {
    const container = document.getElementById("story-container");
    if (!container) return;

    container.innerHTML = "";

    for (const story of stories) {
      const article = document.createElement("article");
      article.className = "box-card";

      article.innerHTML = `
        <div class="img-box" title="${story.name}">
          <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}">
        </div>
        <div class="content-card">
          <h3>${story.name}</h3>
          <h4>${story.locationName || "Tanpa Lokasi"}</h4>
          <p>${story.description}</p>
          <button class="ghost-btn" data-story='${JSON.stringify(story)}'>
            read more...
          </button>
        </div>
      `;

      container.appendChild(article);
    }

    this.bindDetailButtons();
  }

  bindDetailButtons(handler) {
    const buttons = document.querySelectorAll(".ghost-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const story = JSON.parse(btn.getAttribute("data-story"));
        if (typeof handler === "function") handler(story);
      });
    });
  }


showStoryDetailPopup(story, isBookmarked, onToggleBookmark) {
  const mapId = `map-${Date.now()}`;
  const popup = document.createElement("div");
  popup.classList.add("story-popup");

  popup.innerHTML = `
    <div class="popup-content">
      <img src="${story.photoUrl}" alt="Foto cerita detail dari ${story.name}" />
        <div class="story-meta">
          <p><strong>${story.name}</strong> • ${new Date(story.createdAt).toLocaleDateString()}</p>
          <p>${story.description}</p>
          <p>📍 ${story.locationName || "Tidak diketahui"}</p>
        </div>

        <div class="bookmark-button-wrapper">
          <button id="bookmark-btn" class="${isBookmarked ? "unsave-btn" : "save-btn"}">
            <i class="fas ${isBookmarked ? "fa-bookmark-slash" : "fa-bookmark"}"></i>
            ${isBookmarked ? "Hapus Cerita" : "Simpan Cerita"}
          </button>
        </div>
      <div id="${mapId}" class="popup-map"></div>
      <button class="popup-close-btn">Tutup</button>
    </div>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    const map = createMap(mapId);
    const popupText = `
      <strong>Lokasi:</strong> ${story.locationName || "Tidak diketahui"}<br>
      <strong>Lat:</strong> ${story.lat}<br>
      <strong>Lon:</strong> ${story.lon}
    `;
    addMarker(map, [story.lat, story.lon], popupText);
    map.invalidateSize();
  }, 100);

  popup.querySelector(".popup-close-btn").addEventListener("click", () => {
    popup.remove();
  });

  const bookmarkBtn = popup.querySelector("#bookmark-btn");
  if (bookmarkBtn && typeof onToggleBookmark === "function") {
    bookmarkBtn.addEventListener("click", onToggleBookmark);
  }
}

updateBookmarkButton(isSaved) {
  const btn = document.getElementById("bookmark-btn");
  if (!btn) return;
  btn.innerHTML = `
    <i class="fas ${isSaved ? "fa-bookmark-slash" : "fa-bookmark"}"></i>
    ${isSaved ? "Hapus Cerita" : "Simpan Cerita"}
  `;
  btn.className = isSaved ? "unsave-btn" : "save-btn";
  btn.classList.add("bounce");
  setTimeout(() => btn.classList.remove("bounce"), 300);
}
}
