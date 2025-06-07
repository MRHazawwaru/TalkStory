export default class AboutPresenter {
  constructor(view) {
    this.view = view;
    this.init();
  }

  async init() {
    await this.view.render();
  }
}
