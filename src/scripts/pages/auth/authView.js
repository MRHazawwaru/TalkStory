import Swal from "sweetalert2";

export default class AuthView {
  constructor() {
    this.render();
  }

  render() {
    const app = document.getElementById("app");
    app.innerHTML = `
    <main id="main-content">
    <div class="container ${
      location.hash === "#/register" ? "sign-up-mode" : ""
    }">
      <div style="position: absolute; z-index: 9999; top: 20px; right: 20px;">
          <button id="subscribe-btn" class="subscribe-btn solid" color: white;">
            <i class="fas fa-bell"></i> Subscribe
        </button>
      </div>
          <div class="forms-container">
            <div class="signin-signup">
              <!-- LOGIN FORM -->
              <form id="login-form" class="sign-in-form">
                <h2 class="title">Login</h2>
                <div class="input-field">
                  <i class="fas fa-user"></i>
                  <label for="login-email" class="sr-only">Email</label>
                  <input type="email" id="login-email" placeholder="Email" required />
                </div>
                <div class="input-field">
                  <i class="fas fa-lock"></i>
                  <label for="id_password" class="sr-only">Password</label>
                  <input type="password" id="id_password" placeholder="Password" required />
                  <i class="far fa-eye" id="togglePassword" style="cursor: pointer;"></i>
                </div>
                <button id="login-btn" type="submit" class="btn solid">
                  <div class="spinner-circle" style="display: none;">
                    <svg viewBox="0 0 36 36">
                      <defs>
                        <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#ff416c"/>
                          <stop offset="100%" stop-color="#8e2de2"/>
                        </linearGradient>
                      </defs>
                      <circle class="bg" cx="18" cy="18" r="16"></circle>
                      <circle class="progress" cx="18" cy="18" r="16"></circle>
                    </svg>
                  </div>
                  <span class="btn-text">Sign in</span>
                </button>
                <div class="social-media">
                  <a class="icon-mode" onclick="toggleTheme('dark');"><i class="fas fa-moon"></i></a>
                  <a class="icon-mode" onclick="toggleTheme('light');"><i class="fas fa-sun"></i></a>
                </div>
                <p class="text-mode">Change theme</p>
              </form>

              <!-- REGISTER FORM -->
              <form id="register-form" class="sign-up-form">
                <h2 class="title">Register</h2>
                <div class="input-field">
                  <i class="fas fa-user"></i>
                  <label for="name" class="sr-only">Nama Lengkap</label>
                  <input type="text" id="name" placeholder="Name" required />
                </div>
                <div class="input-field">
                  <i class="fas fa-envelope"></i>
                  <label for="email" class="sr-only">Email</label>
                  <input type="email" id="email" placeholder="Email" required />
                </div>
                <div class="input-field">
                  <i class="fas fa-lock"></i>
                  <label for="id_reg" class="sr-only">Password</label>
                  <input type="password" id="id_reg" placeholder="Password" required />
                  <i class="far fa-eye" id="toggleReg" style="cursor: pointer;"></i>
                </div>
                <label class="check">
                  <input type="checkbox" checked />
                  <span class="checkmark">I accept the <a href="terms.html">terms and services</a></span>
                </label>
                <button id="register-btn" type="submit" class="btn solid">
                  <div class="spinner-circle" style="display: none;">
                    <svg viewBox="0 0 36 36">
                      <defs>
                        <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#ff416c"/>
                          <stop offset="100%" stop-color="#8e2de2"/>
                        </linearGradient>
                      </defs>
                      <circle class="bg" cx="18" cy="18" r="16"></circle>
                      <circle class="progress" cx="18" cy="18" r="16"></circle>
                    </svg>
                  </div>
                  <span class="btn-text">Create Account</span>
                </button>
              </form>
            </div>
          </div>

          <!-- PANELS -->
          <div class="panels-container">
            <div class="panel left-panel">
              <div class="content">
                <h3>You don't have an account?</h3>
                <p>Create your account right now to follow people and like publications</p>
                <button class="bttn transparent" id="sign-up-btn">Register</button>
              </div>
              <img src="log.svg" class="image" alt="login illustration" />
            </div>

            <div class="panel right-panel">
              <div class="content">
                <h3>Already have an account?</h3>
                <p>Login to see your notifications and post your favorite photos</p>
                <button class="bttn transparent" id="sign-in-btn">Sign in</button>
              </div>
              <img src="register.svg" class="image" alt="register illustration" />
            </div>
          </div>
        </div>
      </main>
    `;
  }

  bindSubscribeClick() {
    const btn = document.getElementById("subscribe-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        Swal.fire("Silakan login terlebih dahulu untuk berlangganan", "", "info");
      });
    }
  }


  bindLoginForm(handler) {
    const form = document.getElementById("login-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("id_password").value;
      handler({ email, password });
    });
  }

  bindRegisterForm(handler) {
    const form = document.getElementById("register-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("id_reg").value;
      handler({ name, email, password });
    });
  }

  setButtonLoading(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    const spinner = btn.querySelector(".spinner-circle");
    const text = btn.querySelector(".btn-text");

    if (!spinner || !text) return;

    if (isLoading) {
      btn.classList.add("loading");
      spinner.style.display = "block";
      text.style.display = "none";
    } else {
      btn.classList.remove("loading");
      spinner.style.display = "none";
      text.style.display = "inline-block";
    }
  }
}
