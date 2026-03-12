import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useLocation } from "@/hooks/useLocation";

interface ServiceItem {
  id: number;
  name: string;
  is_selected: boolean;
}

interface TechnicianProfile {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  is_available: boolean;
  latitude: number | null;
  longitude: number | null;
  location_updated_at: string | null;
  services: ServiceItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const AccountSettingsPage = () => {
  const { state, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    latitude,
    longitude,
    locationText,
    isRefreshing,
    refreshLocation,
    setLatitude,
    setLongitude,
    setLocationText,
  } = useLocation();

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<TechnicianProfile>(
        `${API_URL}/api/technician-profile/profile`,
      );

      setFirstName(data.first_name ?? "");
      setLastName(data.last_name ?? "");
      setPhone(data.phone ?? "");
      setIsAvailable(data.is_available ?? false);

      // ✅ ใช้ setLatitude, setLongitude, setLocationText จาก hook แทน
      setLatitude(data.latitude ? Number(data.latitude) : null);
      setLongitude(data.longitude ? Number(data.longitude) : null);
      if (data.latitude && data.longitude) {
        const lat = Number(data.latitude);
        const lng = Number(data.longitude);
        setLocationText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }

      setAllServices(data.services.map((s) => ({ ...s })));
      setSelectedServices(
        data.services.filter((s) => s.is_selected).map((s) => s.id),
      );
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลได้");
      toast.error("ไม่สามารถโหลดข้อมูลได้กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // handleSave: ส่งข้อมูลทั้งหมดไปอัปเดตที่ backend
  const handleSave = async () => {
    setError("");
    setIsSaving(true);
    try {
      await axios.put(`${API_URL}/api/technician-profile/profile`, {
        first_name: firstName, // เปลี่ยนจาก first_name เป็น firstName ตาม state
        last_name: lastName, // เปลี่ยนจาก last_name เป็น lastName ตาม state
        phone,
        latitude,
        longitude,
        is_available: isAvailable,
        service_ids: selectedServices, // ส่งเฉพาะ ID ของบริการที่เลือก
      });
      toast.success("อัพเดทข้อมูลของท่านเรียบร้อยแล้ว");
    } catch (err) {
      setError("ไม่สามารถบันทึกข้อมูลได้");
      toast.error("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // toggleService: เพิ่ม/ลบ service id จาก selectedServices
  const toggleService = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  // Skeleton — แสดงระหว่างรอ API โหลดครั้งแรก
  // ทำให้ user รู้ว่า "กำลังโหลด" แทนที่จะเห็นหน้าว่างเปล่า
  if (isLoading) {
    return <SkeletonLoader />;
  }
  // Spinner overlay — แสดงระหว่างรอ GPS + Nominatim
  // และไม่ควรแก้ไข form ระหว่างที่ตำแหน่งกำลังอัพเดท
  if (isRefreshing) {
    return (
      <TechnicianLayout headerActions={null}>
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
          <Spinner className="w-10 h-10 text-blue-600" />
          <p className="text-[16px] text-gray-600 font-prompt">
            กำลังรีเฟรชตำแหน่งที่อยู่ปัจจุบันของคุณ
          </p>
        </div>
      </TechnicianLayout>
    );
  }

  // ปุ่มยืนยัน inject เข้า header ผ่าน headerActions prop
  // เมื่อ isSaving=true → แสดง Spinner แทนข้อความ "ยืนยัน"
  // disabled ป้องกันการกดซ้ำระหว่างบันทึก

  const headerActions = (
    <>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 text-[16px] font-medium hover:bg-blue-100 transition-colors cursor-pointer"
      >
        ยกเลิก
      </button>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-5 py-2 rounded-lg bg-blue-600 text-white text-[16px] font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-70 min-w-20 flex items-center justify-center"
      >
        {isSaving ? <Spinner className="w-5 h-5 text-white" /> : "ยืนยัน"}
      </button>
    </>
  );

  return (
    <ProtectedRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      userRole={state.user?.role ?? null}
      requiredRole="technician"
    >
      <TechnicianLayout headerActions={headerActions}>
        <div className="w-full font-prompt overflow-hidden px-0">
          {/* แสดง error ถ้ามี */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[14px]">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200">
            {/* Section 1: รายละเอียดบัญชี — ไม่เปลี่ยน layout เลย แค่เปลี่ยน value และ onChange */}
            <div className="p-4 sm:p-8">
              <h2 className="text-[20px] font-medium text-black mb-6">
                รายละเอียดบัญชี
              </h2>
              <div className="flex flex-col gap-7">
                <div className="flex flex-row items-center gap-4">
                  <label className="text-[16px] font-medium text-gray-700 w-22 shrink-0 sm:w-45">
                    ชื่อ<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex-1 min-w-0 h-13 px-4 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-blue-500 transition-colors sm:max-w-xl"
                  />
                </div>

                <div className="flex flex-row items-center gap-4">
                  <label className="text-[16px] font-medium text-gray-700 w-22 shrink-0 sm:w-45">
                    นามสกุล<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="flex-1 min-w-0 h-13 px-4 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-blue-500 transition-colors sm:max-w-xl"
                  />
                </div>

                <div className="flex flex-row items-center gap-4">
                  <label className="text-[16px] font-medium text-gray-700 w-22 shrink-0 sm:w-45">
                    เบอร์ติดต่อ<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 min-w-0 h-13 px-4 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-blue-500 transition-colors sm:max-w-xl"
                  />
                </div>

                <div className="flex flex-row items-start gap-6">
                  <label className="text-[16px] font-medium text-gray-700 w-20 shrink-0 pt-2.5 sm:w-43">
                    ตำแหน่งที่อยู่ปัจจุบัน
                    <span className="text-red-600">*</span>
                  </label>
                  <div className="flex-1 flex flex-col sm:flex-row gap-5 min-w-0">
                    <div className="flex-1 min-h-11 px-4 py-2.5 border border-gray-300 rounded-lg text-[16px] text-gray-500 leading-relaxed overflow-hidden sm:max-w-xl">
                      {locationText || "ยังไม่มีข้อมูลตำแหน่ง"}
                    </div>
                    <button
                      onClick={refreshLocation}
                      disabled={isRefreshing}
                      className="flex items-center justify-center gap-2 h-13 w-28 px-5 border border-blue-600 rounded-lg text-[16px] text-blue-600 hover:bg-gray-50 transition-colors cursor-pointer shrink-0 font-medium disabled:opacity-50"
                    >
                      {isRefreshing ? (
                        <Spinner className="w-4 h-4 text-blue-600" />
                      ) : (
                        <>
                          <RefreshCw size={17} />
                          <span>รีเฟรช</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <hr className="border-t border-gray-300" />
              </div>
            </div>

            {/* Section 2: สถานะบัญชี — ไม่เปลี่ยน layout */}
            <div className="px-6 py-2 sm:px-8 sm:py-4 sm:flex sm:items-start sm:gap-24">
              <h2 className="text-[20px] font-semibold text-black mb-4">
                สถานะบัญชี
              </h2>
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setIsAvailable((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 mt-0.5 cursor-pointer ${
                    isAvailable ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      isAvailable ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <div className="mb-5">
                  <p className="text-[18px] font-medium text-black">
                    พร้อมให้บริการ
                  </p>
                  <p className="text-[16px] text-black mt-0.5 font-light">
                    ระบบจะแสดงคำสั่งซ่อมในบริเวณใกล้เคียงตำแหน่งที่อยู่ปัจจุบัน
                    ให้สามารถเลือกรับงานได้
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-t border-gray-300 mx-4 sm:mx-8" />

            {/* Section 3: บริการที่รับซ่อม — เปลี่ยนจาก ALL_SERVICES hardcode → allServices จาก API */}
            <div className="px-6 py-3 sm:p-8 sm:flex sm:gap-18">
              <h2 className="text-[20px] font-semibold text-black mb-4">
                บริการที่รับซ่อม
              </h2>
              <div className="flex flex-col gap-4">
                {allServices.map((service) => {
                  const checked = selectedServices.includes(service.id);
                  return (
                    <label
                      key={service.id}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => toggleService(service.id)}
                    >
                      <div
                        className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-400"
                        }`}
                      >
                        {checked && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-[16px] text-black select-none">
                        {service.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </TechnicianLayout>
    </ProtectedRoute>
  );
};

export default AccountSettingsPage;
