import renderWithTransition from "../../utils/transitionHelper";
import bindSkipToContent from "../../utils/skip";

export default class HomeView {
  async render() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    const html = `
        <div class="home">
          <div class="contain">
            <section class="home-banner">
              <img src="hero.png" alt="home" class="banner-img" />
            </section>
            <section class="home-section">
              <h1>Selamat Datang di TalkStory</h1>
              <p>Tempat berbagai cerita dari siapa saja, untuk siapa saja.</p>
              <div class="intro">
                <p>Aplikasi ini dibuat untuk memudahkan siapa saja berbagi cerita dan pengalaman secara visual dan interaktif.</p>
                <a href="#/add-story" id="post-story-button">Posting Cerita</a>
              </div>
            </section>
          </div>
        </div>
    `;

    await renderWithTransition(mainContent, html);
    bindSkipToContent();
  }

  bindPostButton(handler) {
    const button = document.getElementById("post-story-button");
    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        handler();
      });
    }
  }

  navigateToAddStory() {
    location.hash = "/add-story";
  }
}
