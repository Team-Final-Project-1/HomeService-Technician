"use client";
import { useEffect } from "react";
import { X, Navigation } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// แก้ปัญหา Leaflet default icon หาย (เกิดเฉพาะใน Next.js/Webpack)
// Leaflet โหลด icon จาก URL แต่ Next.js bundle ทำให้ path ผิด
// ต้อง override ด้วย CDN
const technicianIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const customerIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// FitBounds Component
// ทำให้ map zoom และ pan อัตโนมัติให้เห็น marker ทั้งสองพอดี
// ต้องเป็น component แยกเพราะต้องใช้ useMap() hook
// ซึ่งใช้ได้แค่ใน child ของ <MapContainer> เท่านั้น
const FitBounds = ({
  techLat,
  techLng,
  custLat,
  custLng,
}: {
  techLat: number;
  techLng: number;
  custLat: number;
  custLng: number;
}) => {
  const map = useMap();

  useEffect(() => {
    // fitBounds ทำให้ map ครอบคลุมทั้งสอง marker พอดี
    // padding เพิ่มพื้นที่รอบๆ ไม่ให้ marker ชิดขอบ
    map.fitBounds(
      [
        [techLat, techLng],
        [custLat, custLng],
      ],
      { padding: [60, 60] },
    );
  }, [map, techLat, techLng, custLat, custLng]);

  return null; // ไม่ render อะไร แค่ทำงานใน useEffect
};


// Props ที่ MapModal รับ
interface MapModalProps {
  customerLat: number;
  customerLng: number;
  technicianLat: number;
  technicianLng: number;
  distanceKm: number;
  customerName: string;
  onClose: () => void;
}

const MapModal = ({
  customerLat,
  customerLng,
  technicianLat,
  technicianLng,
  distanceKm,
  customerName,
  onClose,
}: MapModalProps) => {
  // เปิด Google Maps นำทางจากตำแหน่งช่าง → ลูกค้า
  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/${technicianLat},${technicianLng}/${customerLat},${customerLng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-prompt">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-[18px] font-semibold text-gray-900">แผนที่</h2>
            <p className="text-[14px] text-gray-500 mt-0.5">
              ระยะทาง{" "}
              <span className="text-blue-600 font-medium">
                {distanceKm} กม.
              </span>{" "}
              จากตำแหน่งของคุณ
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Map */}
        {/* h-72 กำหนดความสูงแผนที่ */}
        {/* z-0 ป้องกัน Leaflet controls ทับ modal header */}
        <div className="h-120 w-full z-0">
          <MapContainer
            center={[technicianLat, technicianLng]}
            zoom={13}
            className="h-full w-full"
            zoomControl={true}
          >
            {/* TileLayer คือ tile ของแผนที่ ใช้ OpenStreetMap ฟรีไม่ต้อง API key */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Marker ช่าง (สีน้ำเงิน) */}
            <Marker
              position={[technicianLat, technicianLng]}
              icon={technicianIcon}
            >
              <Popup>ตำแหน่งของคุณ</Popup>
            </Marker>

            {/* Marker ลูกค้า (สีแดง) */}
            <Marker position={[customerLat, customerLng]} icon={customerIcon}>
              <Popup>คุณ {customerName}</Popup>
            </Marker>

            {/* FitBounds ปรับ zoom อัตโนมัติให้เห็น marker ทั้งคู่ */}
            <FitBounds
              techLat={technicianLat}
              techLng={technicianLng}
              custLat={customerLat}
              custLng={customerLng}
            />
          </MapContainer>
        </div>

        {/* Footer: ปุ่มนำทาง */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleNavigate}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[16px] font-medium py-3 rounded-xl transition-colors cursor-pointer"
          >
            <Navigation size={18} />
            นำทางไปหาลูกค้า
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
