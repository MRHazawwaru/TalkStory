import Swal from "sweetalert2";
import renderWithTransition from "../../utils/transitionHelper";
import bindSkipToContent from "../../utils/skip";
import { createMap, addMarker } from "../../utils/map.js";

export default class AddStoryView {
  constructor() {
    this.uploadedImage = null;
    this.capturedImage = null;
  }

  async render() {
    const mainContent = document.getElementById("main-content");

    const html = `
        <div class="add-story-card">
          <h2>Posting Cerita</h2>
          <form id="story-form">
            <label for="description" class="sr-only">Isi Cerita</label>
            <textarea id="description" placeholder="Ceritakan pengalaman Anda..." required></textarea><br>

            <label for="photo-options" class="sr-only">Foto</label>
            <div class="photo-options">
              <button type="button" id="upload-option" class="option-button">
                <i class="fa fa-upload"></i> Unggah Foto
              </button>
              <button type="button" id="camera-option" class="option-button">
                <i class="fa fa-camera"></i> Ambil Foto
              </button>
            </div>

            <div id="camera-wrapper" style="display: none;">
              <video id="camera" autoplay></video>
              <button type="button" id="capture">Ambil Foto</button>
            </div>

            <input type="file" id="upload" accept="image/*" style="display: none;" /><br>

            <label>Lokasi</label>
            <div id="map" class="map-style"></div>

            <div class="latlon-wrapper">
              <label for="lat" class="sr-only">Latitude</label>
              <input type="text" id="lat" placeholder="Latitude" readonly />
              <label for="lon" class="sr-only">Longitude</label>
              <input type="text" id="lon" placeholder="Longitude" readonly />
            </div><br>

            <div class="form-actions">
              <button type="button" id="cancel" class="cancel">Batal</button>
              <button type="submit" class="primary">Posting Cerita</button>
            </div>
          </form>
        </div>
    `;

    if (mainContent) {
      await renderWithTransition(mainContent, html);
      bindSkipToContent();
    }
  }

  renderMap(onMapClick) {
    this.map = createMap("map", onMapClick);
  }

  addMarkerToMap(latlng, label) {
    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = addMarker(this.map, latlng, label);
  }

  async showAlert(title, text, icon) {
    return Swal.fire(title, text, icon);
  }

  async showConfirmDialog(title, text) {
    const result = await Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Izinkan",
      cancelButtonText: "Batal",
    });
    return result.isConfirmed;
  }

  bindEvents({ onSubmit, onCancel, onOptionSelect, onCapture, onFileUpload }) {
    const cancelBtn = document.getElementById("cancel");
    const uploadBtn = document.getElementById("upload-option");
    const cameraBtn = document.getElementById("camera-option");
    const captureBtn = document.getElementById("capture");
    const form = document.getElementById("story-form");
    const uploadInput = this.getUploadInput();

    if (cancelBtn) cancelBtn.addEventListener("click", onCancel);
    if (uploadBtn)
      uploadBtn.addEventListener("click", () => {
        this.toggleCamera(false);
        onOptionSelect("upload");
      });
    if (cameraBtn)
      cameraBtn.addEventListener("click", () => {
        onOptionSelect("camera");
      });
    if (captureBtn) captureBtn.addEventListener("click", onCapture);
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const lat = document.getElementById("lat").value;
        const lon = document.getElementById("lon").value;
        const image = this.uploadedImage || this.capturedImage;

        if (!image) {
          return Swal.fire(
            "Oops",
            "Silakan pilih atau ambil gambar dulu.",
            "warning"
          );
        }

        onSubmit({ description, lat, lon, image });
      });
    }
    if (uploadInput) {
      uploadInput.addEventListener("change", (e) => {
        onFileUpload(e.target.files[0]);
      });
    }
  }

  toggleCamera(show) {
    document.getElementById("camera-wrapper").style.display = show
      ? "block"
      : "none";
    document.getElementById("upload").style.display = show ? "none" : "block";
  }

  updateLatLon(lat, lon) {
    document.getElementById("lat").value = lat;
    document.getElementById("lon").value = lon;
  }

  setCapturedImage(blob) {
    this.capturedImage = blob;
  }

  setUploadedImage(file) {
    this.uploadedImage = file;
  }

  getUploadInput() {
    return document.getElementById("upload");
  }

  getVideoElement() {
    return document.getElementById("camera");
  }

  navigateToStoryList() {
    location.hash = "/story-list";
  }

  async captureImage(video) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  }
}
