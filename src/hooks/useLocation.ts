import { useState } from "react";
import { toast } from "sonner";

export const useLocation = (
  onRefreshed?: (lat: number, lng: number) => void,
) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationText, setLocationText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ฟังก์ชันนี้จะถูกเรียกตอนเริ่มต้น เพื่อเซ็ต location จาก backend (ถ้ามี) และแปลง lat/lng เป็นที่อยู่ที่เป็น text
  const initLocation = async (lat: number | null, lng: number | null) => {
    if (!lat || !lng) return;
    setLatitude(lat);
    setLongitude(lng);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=th`,
      );
      const data = await response.json();
      setLocationText(data.display_name);
    } catch (err) {
      console.error("Error fetching location", err);
      setLocationText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  // ฟังก์ชันนี้จะถูกเรียกเมื่อกดปุ่ม refresh location เพื่อดึงพิกัดใหม่จาก GPS และอัปเดตไปยัง backend
  const refreshLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser ไม่รองรับการดึงตำแหน่ง");
      return;
    }

    setIsRefreshing(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=th`,
          );
          const data = await response.json();
          setLocationText(data.display_name);
        } catch (err) {
          console.error("Error fetching location", err);
          setLocationText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        } finally {
          setIsRefreshing(false);
          if (onRefreshed) {
            onRefreshed(lat, lng);
          }
        }
      },
      () => {
        toast.error("ไม่สามารถดึงตำแหน่งได้ กรุณาอนุญาตการเข้าถึง GPS");
        setIsRefreshing(false);
      },
    );
  };

  return {
    latitude,
    longitude,
    locationText,
    isRefreshing,
    refreshLocation,
    initLocation,
    setLatitude,
    setLongitude,
    setLocationText,
  };
};
