import Api from "../../data/api.js";
import { showAlert } from "../../utils/index.js";
import { initAuthUI } from "../../utils/authUI.js";

export default class AuthPresenter {
  constructor(view) {
    this.view = view;
    this.init();
  }

  async init() {
    await this.view.render();
    initAuthUI();
    this.view.bindLoginForm(this.handleLogin.bind(this));
    this.view.bindRegisterForm(this.handleRegister.bind(this));
  }

  async handleLogin({ email, password }) {
    try {
      this.view.setButtonLoading("login-btn", true);
      const response = await Api.login(email, password);
      if (response.error) {
        showAlert("Login Gagal", response.message, "error");
      } else {
        localStorage.setItem("token", response.loginResult.token);
        await showAlert("Login Berhasil", "Selamat datang!", "success");
        location.hash = "/story-list";
      }
    } catch (error) {
      showAlert("Kesalahan", "Gagal menghubungi server", "error");
    } finally {
      this.view.setButtonLoading("login-btn", false);
    }
  }

  async handleRegister({ name, email, password }) {
    try {
      this.view.setButtonLoading("register-btn", true);
      const response = await Api.register(name, email, password);
      if (response.error) {
        showAlert("Registrasi Gagal", response.message, "error");
      } else {
        await showAlert("Registrasi Berhasil", "Silakan login", "success");
        location.hash = "/login";
      }
    } catch (error) {
      showAlert("Kesalahan", "Gagal menghubungi server", "error");
    } finally {
      this.view.setButtonLoading("register-btn", false);
    }
  }
}
