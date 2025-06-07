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

const protectedPages = ["home", "about", "story-list", "add-story"];

let currentPresenter = null;

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  document.body.classList.toggle("logged-in", !!token);
  initScrollAnimation();
});

const viewMap = {
  home: () => import("./pages/home/homeView.js"),
  about: () => import("./pages/about/aboutView.js"),
  "story-list": () => import("./pages/storyList/storyListView.js"),
  "add-story": () => import("./pages/addStory/addStoryView.js"),
  auth: () => import("./pages/auth/authView.js"),
};

const presenterMap = {
  home: () => import("./pages/home/homePresenter.js"),
  about: () => import("./pages/about/aboutPresenter.js"),
  "story-list": () => import("./pages/storyList/storyListPresenter.js"),
  "add-story": () => import("./pages/addStory/addStoryPresenter.js"),
  auth: () => import("./pages/auth/authPresenter.js"),
};

const main = async () => {
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

  if (page === "auth") {
    const appRoot = document.getElementById("app");
    if (appRoot) appRoot.innerHTML = "";
    const viewModule = await viewMap[page]();
    const presenterModule = await presenterMap[page]();
    const view = new viewModule.default();
    new presenterModule.default(view);
    return;
  }

  document.body.innerHTML = `<div id="app"></div>`;
  const appView = new AppView();
  new AppPresenter(appView);

  const viewModule = await viewMap[page]();
  const presenterModule = await presenterMap[page]();

  const view = new viewModule.default();
  currentPresenter = new presenterModule.default(view);
};

window.addEventListener("hashchange", main);
window.addEventListener("load", main);

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  document.body.classList.toggle("logged-in", !!token);
});

document.addEventListener("DOMContentLoaded", () => {
  const skipLink = document.querySelector(".skip-link");
  const mainContent = document.querySelector("#main-content");
  if (skipLink && mainContent) {
    skipLink.addEventListener("click", function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }
});
