import L from "leaflet";

const createMap = (elementId, onClick) => {
  const map = L.map(elementId).setView([-7.8, 110.3], 13);

  const baseLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "Map data © OpenStreetMap contributors",
    }
  );

  baseLayer.addTo(map);

  if (onClick) {
    map.on("click", (e) => {
      onClick(e.latlng);
    });
  }

  return map;
};

const addMarker = (map, latlng, popupText = "") => {
  const marker = L.marker(latlng).addTo(map);
  if (popupText) {
    marker.bindPopup(popupText).openPopup();
  }
  return marker;
};

export { createMap, addMarker };
