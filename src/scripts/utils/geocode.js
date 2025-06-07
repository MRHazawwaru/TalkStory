export async function getLocationName(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "TalkStoryApp/1.0" },
    });
    const data = await response.json();
    const address = data.address;
    const village = address.village || address.town || address.city || "-";
    const region = address.state || address.region || "";
    return `${village}, ${region}`;
  } catch (err) {
    console.error("Gagal mengambil nama lokasi:", err);
    return null;
  }
}
