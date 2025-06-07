export default class NotFoundPresenter {
  constructor(view) {
    this.view = view;
    this.init();
  }
  async init() {
    await this.view.render();
  }
}
