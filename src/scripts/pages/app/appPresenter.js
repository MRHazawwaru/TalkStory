import Swal from "sweetalert2";
import {
  initPushNotifications,
  unsubscribePush,
  isPushSubscribed,
} from "../../utils/pushHelper.js";

export default class AppPresenter {
  constructor(view) {
    this.view = view;

    this.view.bindPostButton(() => {
      location.hash = "/add-story";
    });

    this.view.bindLogoutButton(() => {
      localStorage.removeItem("token");
      location.hash = "/login";
    });

    this.view.bindSubscribeButton(this.handleSubscribeClick.bind(this));
  }

  async init() {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const isActuallySubscribed = await isPushSubscribed();
    this.isSubscribed = isActuallySubscribed;

    localStorage.setItem("isSubscribed", this.isSubscribed ? "true" : "false");

    this.view.updateSubscribeButton(this.isSubscribed);
  }

  async handleSubscribeClick() {
    const currentStatus = await isPushSubscribed();
    if (!currentStatus) {
      const granted = await initPushNotifications();
      if (granted) {
        this.isSubscribed = true;
        localStorage.setItem("isSubscribed", "true");
        this.view.updateSubscribeButton(true);
        await Swal.fire({
          title: "Berlangganan berhasil",
          text: "Kamu akan menerima notifikasi cerita baru.",
          icon: "success",
          timer: 2500,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        });
      } else {
        await Swal.fire("Gagal", "Izin notifikasi tidak diberikan", "error");
      }
    } else {
      const result = await Swal.fire({
        title: "Kamu Yakin ingin berhenti berlangganan?",
        text: "Kamu tidak akan menerima pemberitahuan lagi.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await unsubscribePush();
        this.isSubscribed = false;
        localStorage.setItem("isSubscribed", "false");
        this.view.updateSubscribeButton(false);
        await Swal.fire(
          "Berhenti Berlangganan Berhasil",
          "Semoga Harimu Menyenangkan.",
          "info"
        );
      }
    }
  }
}
