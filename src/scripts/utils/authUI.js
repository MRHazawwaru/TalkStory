export function initAuthUI() {
  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");

  if (sign_up_btn && sign_in_btn && container) {
    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }

  const htmlEl = document.getElementsByTagName("html")[0];
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) htmlEl.dataset.theme = currentTheme;

  window.toggleTheme = (theme) => {
    htmlEl.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  };

  const togglePassword = document.querySelector("#togglePassword");
  const password = document.querySelector("#id_password");
  if (togglePassword && password) {
    togglePassword.addEventListener("click", () => {
      const type = password.type === "password" ? "text" : "password";
      password.type = type;
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

  const toggleReg = document.querySelector("#toggleReg");
  const pass = document.querySelector("#id_reg");
  if (toggleReg && pass) {
    toggleReg.addEventListener("click", () => {
      const type = pass.type === "password" ? "text" : "password";
      pass.type = type;
      toggleReg.classList.toggle("fa-eye-slash");
    });
  }
}
