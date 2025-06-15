import { registerServiceWorker } from "./utils/pushHelper.js";
import "../styles/app.css";
import "../styles/auth.css";
import "../styles/home.css";
import "../styles/storyList.css";
import "../styles/addStory.css";
import "../styles/about.css";
import { initScrollAnimation } from "./utils/animate.js";
import "jquery";

import UrlParser from "./routes/url-parser.js";
import routes from "./routes/routes.js";
import AppView from "./pages/app/appView.js";
import AppPresenter from "./pages/app/appPresenter.js";

registerServiceWorker();

const protectedPages = ["home", "about", "story-list", "add-story", "bookmark"];
let currentPresenter = null;

const viewMap = {
  home: () => import("./pages/home/homeView.js"),
  about: () => import("./pages/about/aboutView.js"),
  "story-list": () => import("./pages/storyList/storyListView.js"),
  "add-story": () => import("./pages/addStory/addStoryView.js"),
  auth: () => import("./pages/auth/authView.js"),
  "bookmark": () => import("./pages/bookmark/bookmarkView.js"),
};

const presenterMap = {
  home: () => import("./pages/home/homePresenter.js"),
  about: () => import("./pages/about/aboutPresenter.js"),
  "story-list": () => import("./pages/storyList/storyListPresenter.js"),
  "add-story": () => import("./pages/addStory/addStoryPresenter.js"),
  auth: () => import("./pages/auth/authPresenter.js"),
  "bookmark": () => import("./pages/bookmark/bookmarkPresenter.js"),
};

const renderAppShell = () => {
  const appRoot = document.getElementById("app");
  if (!appRoot) {
    const wrapper = document.createElement("div");
    wrapper.id = "app";
    document.body.appendChild(wrapper);
  }
  const appView = new AppView();
  appView.render();
  const appPresenter = new AppPresenter(appView);
  appPresenter.init();
};

const loadPage = async () => {
  const url = UrlParser.parseActiveUrl();
  const page = routes[url];

  const token = localStorage.getItem("token");

  if ((!token && url === "/") || (protectedPages.includes(page) && !token)) {
    location.hash = "/login";
    return;
  }

  if (!page) {
    location.hash = "/not-found";
    return;
  }

  if (currentPresenter && typeof currentPresenter.destroy === "function") {
    currentPresenter.destroy();
  }

  await new Promise((resolve) => setTimeout(resolve, 0));

  const viewModule = await viewMap[page]().catch((err) => {
    console.error("Gagal memuat view chunk:", err);
    location.reload();
  });

  const presenterModule = await presenterMap[page]();
  const view = new viewModule.default();
  currentPresenter = new presenterModule.default(view);
};

const main = async () => {
  renderAppShell();
  await loadPage();
};

window.addEventListener("hashchange", main);
window.addEventListener("load", async () => {
  const token = localStorage.getItem("token");
  document.body.classList.toggle("logged-in", !!token);
  initScrollAnimation();
  await main();
});

document.addEventListener("click", (e) => {
  const skipLink = e.target.closest(".skip-link");
  if (skipLink) {
    e.preventDefault();
    const mainContent = document.querySelector("#main-content");
    if (mainContent) {
      skipLink.blur();
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  }
});

if (process.env.NODE_ENV === "development") {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    for (const reg of regs) {
      reg.unregister().then(() => console.log("SW unregistered (dev)"));
    }
  });
  caches.keys().then((keys) => {
    keys.forEach((k) => caches.delete(k));
    console.log("Cache cleared (dev)");
  });
}
