import { useState, useEffect } from "react";
import { MapPin, Bell } from "lucide-react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import ServiceRequestCard, { ServiceRequest } from "./ServiceRequestCard";
import AcceptModal from "./AcceptModal";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useLocation } from "@/hooks/useLocation";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// แปลง "2024-04-25" → "25/04/2567" (พ.ศ.)
const formatThaiDate = (dateStr: string): string => {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${Number(y) + 543}`;
};

// แปลง "13:00:00" → "13.00 น."
const formatThaiTime = (timeStr: string): string => {
  const [h, m] = timeStr.split(":");
  return `${h}.${m} น.`;
};

// แปลง API response → ServiceRequest สำหรับ UI
const mapToServiceRequest = (raw: any): ServiceRequest => ({
  ...raw,
  serviceName: raw.service_names?.join(", ") ?? "-",
  date: raw.appointment_date ? formatThaiDate(raw.appointment_date) : "-",
  time: raw.appointment_time ? formatThaiTime(raw.appointment_time) : "-",
  items: raw.item_names?.join(", ") ?? "-",
  orderCode: raw.order_code,
  totalPrice: `${Number(raw.net_price).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿`,
});

// Main Page

const ServiceRequests = () => {
  const { state, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]); //???
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [isConfirming, setIsConfirming] = useState(false);

  // Fn1: ยิง API เพื่อดึงออเดอร์ที่ลูกค้าชำระเงินแล้ว และพร้อมให้ช่างรับงาน (ตามเงื่อนไขของ backend)
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/api/technician-orders/orders/available`,
      );
      setRequests(data.map(mapToServiceRequest)); // ??
    } catch (err) {
      console.error("Error fetching orders", err);
      toast.error("ไม่สามารถโหลดรายการงานได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  // Fn2: รับพิกัดจาก useLocation → PATCH ไป backend → refetch orders ใหม่ (เผื่อมีการอัปเดตงานตาม location)
  const handleRefreshed = async (lat: number, lng: number) => {
    try {
      await axios.patch(`${API_URL}/api/technician-profile/location`, {
        latitude: lat,
        longitude: lng,
      });
      await fetchOrders();
    } catch (err) {
      console.error("Error updating location", err);
      toast.error("ไม่สามารถอัปเดตตำแหน่งได้");
    }
  };

  // ใช้ custom hook สำหรับจัดการ location (ดึงจาก backend ตอนเริ่มต้น, แปลงเป็น text, รีเฟรชจาก GPS)
  const { locationText, isRefreshing, refreshLocation, initLocation } =
    useLocation(handleRefreshed);

  // ตอนเริ่มต้น: ดึง orders + location จาก backend
  useEffect(() => {
    const init = async () => {
      await fetchOrders();
      try {
        const { data } = await axios.get(
          `${API_URL}/api/technician-profile/profile`,
        );
        await initLocation(
          data.latitude ? Number(data.latitude) : null,
          data.longitude ? Number(data.longitude) : null,
        );
      } catch (err) {
        // ไม่มี location ก็ไม่เป็นไร แสดง "ยังไม่มีข้อมูลตำแหน่ง" ตามเดิม
        console.error("Error initializing location", err);
      }
    };
    init();
  }, []);

  // กดรับงาน → เปิด modal
  const handleAccept = (request: ServiceRequest) => {
    setSelectedRequest(request);
  };

  // ยืนยันรับงาน → POST /api/technician-orders/orders/:id/accept
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
      // 409 = มีช่างรับงานนี้ไปแล้ว
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

  // ปฏิเสธงาน → POST /api/technician-orders/orders/:id/reject
  const handleReject = async (id: number) => {
    try {
      await axios.post(`${API_URL}/api/technician-orders/orders/${id}/reject`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("ไม่สามารถปฏิเสธงานได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <ProtectedRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      userRole={state.user?.role ?? null}
      requiredRole="technician"
    >
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

          {/* Orders List */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner className="w-8 h-8 text-blue-600" />
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center justify-center gap-3 text-center">
              <Bell size={40} className="text-gray-300" />
              <p className="text-gray-400 text-[15px]">
                ไม่มีคำขอบริการในขณะนี้
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <ServiceRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>

        {/* Accept Modal */}
        {selectedRequest && (
          <AcceptModal
            request={selectedRequest}
            onConfirm={handleConfirmAccept}
            onCancel={() => setSelectedRequest(null)}
            isConfirming={isConfirming}
          />
        )}
      </TechnicianLayout>
    </ProtectedRoute>
  );
};

export default ServiceRequests;
