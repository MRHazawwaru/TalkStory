import renderWithTransition from "../../utils/transitionHelper";
import bindSkipToContent from "../../utils/skip";

export default class AboutView {
  async render() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    const html = `
        <div class="about">
          <div class="contain-about">
            <section class="about-banner">
              <img src="hero.png" alt="about" class="img-banner" />
            </section>
            <section class="about-section">
              <h1>Tentang TalkStory</h1>
              <p><strong>TalkStory</strong> adalah ruang digital untuk siapa saja yang ingin berbagi cerita.</p>
              <div class="about-intro">
                <p>Melalui TalkStory, kamu bisa membagikan kisahmu dalam bentuk teks dan gambar, lengkap dengan lokasi.</p><br>
                <p>TalkStory percaya setiap cerita layak dibagikan. Di sini, kamu menginspirasi, menghubungkan, dan didengarkan.</p>
              </div>
              <div class="button">
                <a href="#/story-list" class="btna">Jelajahi Cerita</a>
              </div>
            </section>
          </div>
        </div>
    `;

    await renderWithTransition(mainContent, html);
    bindSkipToContent();
  }
}
