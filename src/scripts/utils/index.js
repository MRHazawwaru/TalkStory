import Swal from "sweetalert2";

const showAlert = (title, text, icon = "info") => {
  Swal.fire({ title, text, icon });
};

export { showAlert };
