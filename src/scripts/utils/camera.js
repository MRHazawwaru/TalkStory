let stream;

/**
 * @param {HTMLVideoElement} videoElement
 */
const startCamera = async (videoElement) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  } catch (err) {
    console.error("Gagal mengakses kamera:", err);
    throw new Error(
      "Tidak bisa mengakses kamera. Pastikan izin telah diberikan."
    );
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
};

export { startCamera, stopCamera };
