import { useState, useEffect, useRef } from "react";
import { MapPin, Bell } from "lucide-react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import ServiceRequestCard, { ServiceRequest } from "./ServiceRequestCard";
import AcceptModal from "./AcceptModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useLocation } from "@/hooks/useLocation";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { toast } from "sonner";
import RejectModal from "./RejecModal";
import dynamic from "next/dynamic";

const MapModal = dynamic(() => import("./MapModal"), { ssr: false });

const API_URL = (process.env.NEXT_PUBLIC_API_URL as string).replace(/\/$/, "");

const formatThaiDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const d = String(date.getUTCDate()).padStart(2, "0");
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const y = date.getUTCFullYear() + 543;
  return `${d}/${m}/${y}`;
};

const formatThaiTime = (timeStr: string): string => {
  const [h, m] = timeStr.split(":");
  return `${h}.${m} น.`;
};

const mapToServiceRequest = (raw: any): ServiceRequest => ({
  ...raw,
  serviceName: raw.service_names?.join(", ") ?? "-",
  date: raw.appointment_date ? formatThaiDate(raw.appointment_date) : "-",
  time: raw.appointment_time ? formatThaiTime(raw.appointment_time) : "-",
  items: raw.item_names?.join(", ") ?? "-",
  orderCode: raw.order_code,
  totalPrice: `${Number(raw.net_price).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿`,
});

const ServiceRequests = () => {
  const { state, isAuthenticated } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedRejectRequest, setSelectedRejectRequest] =
    useState<ServiceRequest | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [mapRequest, setMapRequest] = useState<ServiceRequest | null>(null);

  // ใช้ ref ป้องกัน init รันซ้ำ
  const hasInitialized = useRef(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/api/technician-orders/orders/available`,
      );
      const mapped = data.map(mapToServiceRequest);
      setRequests(mapped);
      localStorage.setItem("pendingCount", String(mapped.length));
    } catch {
      toast.error("ไม่สามารถโหลดรายการงานได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshed = async (lat: number, lng: number) => {
    try {
      await axios.patch(`${API_URL}/api/technician-profile/location`, {
        latitude: lat,
        longitude: lng,
      });
      await fetchOrders();
    } catch {
      toast.error("ไม่สามารถอัปเดตตำแหน่งได้");
    }
  };

  const {
    locationText,
    isRefreshing,
    refreshLocation,
    initLocation,
    latitude: techLat,
    longitude: techLng,
  } = useLocation(handleRefreshed);

  // ✅ useEffect 1: เช็ค auth เมื่อ getUserLoading เสร็จ
  useEffect(() => {
    if (state.getUserLoading !== false) return;
    if (!isAuthenticated || state.user?.role !== "technician") {
      router.replace("/login-technician");
    }
  }, [state.getUserLoading, isAuthenticated]);

  // ✅ useEffect 2: init หน้า — รอให้ auth เสร็จก่อนเท่านั้น
  useEffect(() => {
    // รอจน getUserLoading = false และผ่าน auth แล้ว
    if (state.getUserLoading !== false) return;
    if (!isAuthenticated || state.user?.role !== "technician") return;
    // ป้องกัน init รันซ้ำเมื่อ state เปลี่ยน
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/technician-profile/profile`,
        );
        setIsAvailable(data.is_available);
        await initLocation(
          data.latitude ? Number(data.latitude) : null,
          data.longitude ? Number(data.longitude) : null,
        );
        if (data.is_available) {
          await fetchOrders();
        }
      } catch {
        toast.error("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        // ✅ ปิด initializing ครั้งเดียว หลังทุกอย่างเสร็จ
        setIsInitializing(false);
      }
    };

    init();
  }, [state.getUserLoading, isAuthenticated]);

  const handleToggleAvailable = async () => {
    setIsTogglingStatus(true);
    try {
      await axios.patch(`${API_URL}/api/technician-profile/availability`, {
        is_available: true,
      });
      setIsAvailable(true);
      await fetchOrders();
    } catch {
      toast.error("ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleAccept = (request: ServiceRequest) => setSelectedRequest(request);

  const handleConfirmAccept = async () => {
    if (!selectedRequest) return;
    setIsConfirming(true);
    try {
      await axios.post(
        `${API_URL}/api/technician-orders/orders/${selectedRequest.id}/accept`,
      );
      toast.success("รับงานเรียบร้อยแล้ว");
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      setSelectedRequest(null);
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("งานนี้ถูกรับไปแล้ว");
        setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
        setSelectedRequest(null);
      } else {
        toast.error("ไม่สามารถรับงานได้ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReject = (request: ServiceRequest) => {
    setSelectedRejectRequest(request);
  };

  const handleConfirmReject = async () => {
    if (!selectedRejectRequest) return;
    setIsRejecting(true);
    try {
      await axios.post(
        `${API_URL}/api/technician-orders/orders/${selectedRejectRequest.id}/reject`,
      );
      setRequests((prev) =>
        prev.filter((r) => r.id !== selectedRejectRequest.id),
      );
      setSelectedRejectRequest(null);
    } catch {
      toast.error("ไม่สามารถปฏิเสธงานได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleViewMap = (request: ServiceRequest) => setMapRequest(request);

  // ✅ ระหว่างเช็ค auth หรือ init → Spinner ชั้นเดียว ไม่มี ProtectedRoute ซ้อน
  if (state.getUserLoading !== false || isInitializing) {
    return (
      <TechnicianLayout>
        <div className="flex justify-center py-16">
          <Spinner className="w-8 h-8 text-blue-600" />
        </div>
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout>
      <div className="font-prompt space-y-4 w-full">
        {/* Location Banner */}
        <div className="bg-blue-100 border border-blue-300 rounded-xl px-5 py-4 flex items-center gap-4">
          <MapPin size={22} className="text-blue-600 shrink-0" />
          <div className="flex-1">
            <p className="text-[14px] text-blue-800 font-normal">
              ตำแหน่งที่อยู่ปัจจุบัน
            </p>
            <p className="text-[16px] text-blue-600 font-normal">
              {locationText || "ยังไม่มีข้อมูลตำแหน่ง"}
            </p>
          </div>
          <button
            onClick={refreshLocation}
            disabled={isRefreshing}
            className="border border-blue-600 bg-blue-100 text-blue-600 text-[16px] font-medium px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isRefreshing ? (
              <Spinner className="w-4 h-4 text-blue-600" />
            ) : (
              "รีเฟรช"
            )}
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="w-8 h-8 text-blue-600" />
          </div>
        ) : !isAvailable ? (
          <div className="bg-white rounded-xl border border-gray-300 py-16 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Bell size={32} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-2">
                ต้องการรับแจ้งเตือนคำขอบริการสั่งซ่อม?
              </h3>
              <p className="text-[16px] text-gray-700 font-light mx-auto">
                เปิดใช้งานสถานะพร้อมให้บริการ
                เพื่อแสดงรายการและรับงานซ่อมในบริเวณตำแหน่งที่คุณอยู่
              </p>
            </div>
            <button
              onClick={handleToggleAvailable}
              disabled={isTogglingStatus}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[16px] font-medium px-6 py-3 rounded-xl transition-colors cursor-pointer mt-5 disabled:opacity-70 min-w-60 justify-center"
            >
              {isTogglingStatus ? (
                <Spinner className="w-5 h-5 text-white" />
              ) : (
                "เปลี่ยนสถานะเป็นพร้อมให้บริการ"
              )}
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center justify-center gap-3 text-center">
            <Bell size={40} className="text-gray-300" />
            <p className="text-gray-400 text-[15px]">ไม่มีคำขอบริการในขณะนี้</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <ServiceRequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                onViewMap={handleViewMap}
              />
            ))}
          </div>
        )}
      </div>

      {selectedRequest && (
        <AcceptModal
          request={selectedRequest}
          onConfirm={handleConfirmAccept}
          onCancel={() => setSelectedRequest(null)}
          isConfirming={isConfirming}
        />
      )}

      {selectedRejectRequest && (
        <RejectModal
          request={selectedRejectRequest}
          onConfirm={handleConfirmReject}
          onCancel={() => setSelectedRejectRequest(null)}
          isRejecting={isRejecting}
        />
      )}

      {mapRequest && techLat && techLng && (
        <MapModal
          customerLat={mapRequest.customer_lat!}
          customerLng={mapRequest.customer_lng!}
          technicianLat={techLat}
          technicianLng={techLng}
          distanceKm={mapRequest.distance_km}
          customerName={mapRequest.customer_name}
          onClose={() => setMapRequest(null)}
        />
      )}
    </TechnicianLayout>
  );
};

export default ServiceRequests;
