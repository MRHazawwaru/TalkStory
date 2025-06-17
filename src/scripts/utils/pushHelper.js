import CONFIG from "../config";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};


export const subscribePush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_KEY),
  });

  await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(subscription),
  });

  console.log("Push subscribed & dikirim ke server:", subscription);
  return subscription;
};


export const unsubscribePush = async () => {
  const registration = await navigator.serviceWorker.ready;

  if (registration.pushManager) {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.log("Push unsubscribed");
    } else {
      console.log("Tidak ada subscription yang ditemukan");
    }
  } else {
    console.log("Push manager tidak tersedia");
  }
};
export const isPushSubscribed = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.warn("Gagal cek status push:", error);
    return false;
  }
};
export const requestPushPermission = async () => {
  if ("Notification" in window && "serviceWorker" in navigator) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Izin push notification diberikan");
        return true;
      } else {
        console.log("Izin push notification ditolak");
        return false;
      }
    } catch (error) {
      console.error("Gagal meminta izin push notification:", error);
      return false;
    }
  } else {
    console.warn("Push notifications tidak didukung di browser ini");
    return false;
  }
};
export const showNotification = (title, options) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, options);
  } else {
    console.warn("Izin notifikasi belum diberikan atau tidak didukung");
  }
};
export const isPushSupported = () => {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
};
export const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                "service-worker.js",
                {
                    scope: "/TalkStory/",
                }
            );
            console.log("Service Worker terdaftar:", registration);
            return registration;
        } catch (error) {
            console.error("Gagal mendaftarkan Service Worker:", error);
            throw error;
        }
    } else {
        console.warn("Service Worker tidak didukung di browser ini");
        return null;
    }
};
export const initPushNotifications = async () => {
  if (isPushSupported()) {
    const registration = await registerServiceWorker();
    if (!registration) return false;

    const currentPermission = Notification.permission;

    if (currentPermission === "granted") {
      const isSubscribed = await isPushSubscribed();
      if (!isSubscribed) {
        await subscribePush();
      }
      return true;
    }

    if (currentPermission === "default") {
      const permissionGranted = await requestPushPermission();
      if (permissionGranted) {
        await subscribePush();
        return true;
      } else {
        return false;
      }
    }

    console.warn("Push notification permission previously denied.");
    return false;
  } else {
    console.warn("Push notifications tidak didukung di browser ini");
    return false;
  }
};

// export const handlePushEvent = (event) => {
//   let notificationData = {};

//   if (event.data) {
//     notificationData = event.data.json();
//   }

//   const options = {
//     body: notificationData.message || "Ada cerita baru menanti kamu!",
//     icon: "/public/icons/icon-192x192.png",
//     badge: "/public/icons/icon-72x72.png",
//   };

//   event.waitUntil(
//     self.registration.showNotification(
//       notificationData.title || "TalkStory",
//       options
//     )
//   );
// };
// self.addEventListener("push", handlePushEvent);

