export default class AppPresenter {
  constructor(view) {
    this.view = view;

    this.view.bindPostButton(() => {
      location.hash = "/add-story";
    });

    this.view.bindLogoutButton(() => {
      localStorage.removeItem("token");
      location.hash = "/login";
    });
  }
}
