import CONFIG from "../config.js";

const Api = {
  async register(name, email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getStories(token) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async addStory({ token, description, image, lat, lon }) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", image);
    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },
};

export default Api;
