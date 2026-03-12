import { useState } from "react";
import { toast } from "sonner";

export const useLocation = (
  onRefreshed?: (lat: number, lng: number) => void,
) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationText, setLocationText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        } catch {
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
    setLatitude,
    setLongitude,
    setLocationText,
  };
};
