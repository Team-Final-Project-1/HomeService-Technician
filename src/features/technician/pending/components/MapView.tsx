import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type Props = {
  lat: number;
  lng: number;
};

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ lat, lng }: Props) {
  return (
    <div className="h-[250px] w-full rounded-lg overflow-hidden mt-2">
      <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={icon}>
          <Popup>ตำแหน่งลูกค้า</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}