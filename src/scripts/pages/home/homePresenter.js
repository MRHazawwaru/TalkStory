export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.init();
  }

  async init() {
    await this.view.render();
    this.view.bindPostButton(this.handlePostClick.bind(this));
  }

  handlePostClick() {
    this.view.navigateToAddStory();
  }
}
