export default class NotFoundView {
  async render() {
    const main = document.getElementById("main-content");
    if (main) main.innerHTML = `<h2>404 - Halaman tidak ditemukan</h2>`;
  }
}
