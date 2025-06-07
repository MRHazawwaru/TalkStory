import Swal from "sweetalert2";
import Api from "../../data/api.js";
import { startCamera, stopCamera } from "../../utils/camera.js";
import waitForElement from "../../utils/waitForElement";
import { getLocationName } from "../../data/locationModel.js";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.init();
  }

  async init() {
    await this.view.render();
    await waitForElement("#map");

    this.view.renderMap(this.handleMapClick.bind(this));

    this.view.bindEvents({
      onSubmit: this.handleSubmit.bind(this),
      onCancel: this.handleCancel.bind(this),
      onOptionSelect: this.handleOptionSelect.bind(this),
      onCapture: this.handleCapture.bind(this),
      onFileUpload: this.handleUpload.bind(this),
    });

    this.video = this.view.getVideoElement();
  }

  async handleOptionSelect(option) {
    if (option === "camera") {
      const confirmed = await this.view.showConfirmDialog(
        "Aktifkan Kamera?",
        "Izinkan aplikasi menggunakan kamera untuk ambil foto."
      );
      if (confirmed) {
        try {
          await startCamera(this.video);
          this.view.toggleCamera(true);
        } catch (err) {
          this.view.showAlert("Gagal", err.message, "error");
        }
      }
    } else {
      stopCamera();
      this.view.toggleCamera(false);
    }
  }

  async handleCapture() {
    const blob = await this.view.captureImage(this.video);
    this.view.setCapturedImage(blob);
    await this.view.showAlert("Berhasil", "Foto berhasil diambil", "success");
  }

  async handleMapClick(latlng) {
    const { lat, lng } = latlng;
    this.view.updateLatLon(lat, lng);
    const locationName = await getLocationName(lat, lng);
    this.view.addMarkerToMap(latlng, locationName || "Lokasi dipilih");
  }

  handleUpload(file) {
    this.view.setUploadedImage(file);
  }

  async handleSubmit({ description, lat, lon, image }) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User belum login");

      await Api.addStory({ token, description, image, lat, lon });
      await this.view.showAlert(
        "Sukses",
        "Cerita berhasil dikirim!",
        "success"
      );
      this.view.navigateToStoryList();
    } catch (err) {
      this.view.showAlert("Gagal", err.message, "error");
    } finally {
      stopCamera();
    }
  }

  handleCancel() {
    stopCamera();
    this.view.navigateToStoryList();
  }

  destroy() {
    stopCamera();
  }
}
