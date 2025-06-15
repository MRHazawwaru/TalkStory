import renderWithTransition from "../../utils/transitionHelper.js";
import { createMap, addMarker } from "../../utils/map.js";

export default class BookmarkView {
  async render(stories, handlers) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;
    mainContent.innerHTML = '';

    const html = `
  <section class="story-list-section" id="bookmark-section">
    <h2>Cerita Tersimpan</h2>
      ${stories.length === 0 ? `
        <div class="empty-bookmark">
          <i class="fas fa-folder-open fa-3x"></i>
            <h3>Belum Ada Cerita</h3>
            <br>
              <p>Simpan cerita favoritmu untuk dibaca nanti!</p>
            <br>
              <p>Atau kamu ingin jadi yang pertama berbagi cerita?</p>
            <br>
                <button id="post-button" class="btn-book green"><a href="#/add-story"><i class="fa-solid fa-plus"></i> Posting Cerita Pertama</a></button>
          </div>`
          : `
          <div class="container-card" id="story-container">
            ${stories
              .map(
                (story) => `
              <article class="box-card">
                <div class="img-box" title="${story.name}">
                  <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}">
                </div>
                <div class="content-card">
                  <h3>${story.name}</h3>
                  <h4>${new Date(story.createdAt).toLocaleDateString()}</h4>
                  <p>${story.description.substring(0, 100)}...</p>
                  <div class="bookmark-actions">
                    <button class="ghost-btn detail-bookmark-btn" data-story='${JSON.stringify(story)}'>
                      read more...
                    </button>
                    <button class="btn-icon red remove-bookmark-btn" data-id="${story.id}" title="Hapus dari Bookmark">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </article>
            `)
              .join("")}
          </div>`
        }
      </section>
    `;
    await renderWithTransition(mainContent, html);
    this.bindBookmarkPageEvents(handlers);
  }
  bindBookmarkPageEvents(handlers) {
    const section = document.getElementById("bookmark-section");
    if (!section) return;

    if (section.dataset.eventsBound) return;
    section.dataset.eventsBound = "true";

    section.addEventListener("click", (event) => {
      const detailButton = event.target.closest(".detail-bookmark-btn");
      if (detailButton) {
        const story = JSON.parse(detailButton.dataset.story);
        handlers.detailHandler(story);
        return;
      }

      const removeButton = event.target.closest(".remove-bookmark-btn");
      if (removeButton) {
        const storyId = removeButton.dataset.id;
        handlers.removeHandler(storyId);
      }
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

    if (story.lat && story.lon) {
      setTimeout(() => {
        const map = createMap(mapId);
        const popupText = `<strong>Lokasi:</strong> ${story.locationName || "Tidak diketahui"}<br><strong>Lat:</strong> ${story.lat}<br><strong>Lon:</strong> ${story.lon}`;
        addMarker(map, [story.lat, story.lon], popupText);
        map.invalidateSize();
      }, 100);
    } else {
      document.getElementById(mapId).style.display = 'none';
    }
    
    const closePopup = () => popup.remove();
    popup.querySelector(".popup-close-btn").addEventListener("click", closePopup);
    const bookmarkBtn = popup.querySelector("#bookmark-btn");
    if (bookmarkBtn && typeof onToggleBookmark === "function") {
      bookmarkBtn.addEventListener("click", () => onToggleBookmark(closePopup));
    }
  }
}