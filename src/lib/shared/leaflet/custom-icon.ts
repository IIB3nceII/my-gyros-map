import L from 'leaflet';

const customIcon = L.icon({
  iconUrl: '/gyros.jpg',
  iconSize: [38, 38],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76]
});

export default customIcon;
