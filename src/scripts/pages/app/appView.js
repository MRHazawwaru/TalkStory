import bindSkipToContent from "../../utils/skip";

export default class AppView {
  constructor() {
  }

  async render() {
    const app = document.getElementById("app");
    app.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to Content</a>
  <div class="wrapper">
    <div class="wrap">
      <div class="arrow animated bounce"></div>

      <header>
      <nav class="navbar">
      <div class="navbar-left">
      <strong>TalkStory</strong>
      </div>
      <ul class="navbar-center">
      <li><a href="#/home">Home</a></li>
      <li><a href="#/about">About</a></li>
      <li><a href="#/story-list">Cerita</a></li>
      <li style="margin-left: 45px;"><a href="#/bookmark">Bookmark Cerita</a></li>
      </ul>
          <div class="navbar-right">
            <button id="subscribe-btn" class="subscribe-btn">
              <i class="fas fa-bell"></i> Subscribe
            </button>
            <button id="post-button">Posting Cerita</button>
            <button id="logout-button">Logout</button>
          </div>
        </nav>
      </header>
<main id="main-content" tabindex="-1"></main>
    </div>
  </div>
          <footer class="footer">
            <div class="navbar-left">
                <strong>TalkStory</strong>
            </div>
            <nav>
                <ul>
                    <li>© Copyright 2025</li>
                    <li>Coding Camp by DBS Foundation,</li>
                    <li>Dicoding Indonesia</li>
                </ul>
            </nav>
        </footer>
    `;
    bindSkipToContent();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  bindPostButton(handler) {
  const postBtn = document.getElementById("post-button");
  if (postBtn) postBtn.addEventListener("click", handler);
  }

  bindLogoutButton(handler) {
    const logoutBtn = document.getElementById("logout-button");
    if (logoutBtn) logoutBtn.addEventListener("click", handler);
  }

  bindSubscribeButton(handler) {
    const subscribeBtn = document.getElementById("subscribe-btn");
    if (subscribeBtn) subscribeBtn.addEventListener("click", handler);
  }

  updateSubscribeButton(isSubscribed) {
    const btn = document.getElementById("subscribe-btn");
    if (!btn) return;
    if (isSubscribed) {
      btn.innerHTML = `<i class="fas fa-bell-slash"></i> Unsubscribe`;
      btn.classList.remove("btn-red", "bounce");
      btn.classList.add("btn-red", "bounce");
    } else {
      btn.innerHTML = `<i class="fas fa-bell"></i> Subscribe`;
      btn.classList.remove("btn-blue", "bounce");
      btn.classList.add("btn-blue", "bounce");
    }
    setTimeout(() => btn.classList.remove("bounce"), 300);
  }
}