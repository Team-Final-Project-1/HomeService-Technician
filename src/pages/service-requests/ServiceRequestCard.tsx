import { MapPin } from "lucide-react";

// ✅ interface ใหม่ ตรงกับ API response
export interface ServiceRequest {
  id: number;
  order_code: string;
  net_price: number;
  appointment_date: string;   // "2024-04-25"
  appointment_time: string;   // "13:00:00"
  address: string;
  distance_km: number;
  service_names: string[];
  item_names: string[];
  customer_lat: number | null;
  customer_lng: number | null;
  remark: string | null;
  serviceName: string;   // service_names.join(", ")
  date: string;          // format จาก appointment_date
  time: string;          // format จาก appointment_time
  items: string;         // item_names.join(", ")
  orderCode: string;     // order_code
  totalPrice: string;    // format จาก net_price
}

const ServiceRequestCard = ({
  request,
  onAccept,
  onReject,
}: {
  request: ServiceRequest;
  onAccept: (request: ServiceRequest) => void;
  onReject: (id: number) => void;
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-300 p-5 font-prompt overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
        <h3 className="text-[20px] font-medium text-black mb-2 sm:mb-0">
          {request.serviceName}
        </h3>
        {/* วันเวลา — sm+ อยู่ขวา, mobile อยู่ล่างชื่อ */}
        <p className="headline-5 text-gray-700">
          วันเวลาดำเนินการ{" "}
          <span className="hidden sm:inline text-blue-600">
            {request.date} เวลา {request.time}
          </span>
        </p>
        <span className="inline font-medium sm:hidden text-blue-600">
          {request.date} เวลา {request.time}
        </span>
      </div>

      {/* Details + Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        {/* Details Grid */}
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          <span className="headline-5 text-gray-700">รายการ</span>
          <span className="text-[16px] text-utility-black font-normal">
            {request.items}
          </span>

          <span className="headline-5 text-gray-700">รหัสคำสั่งซ่อม</span>
          <span className="text-[16px] text-utility-black font-normal">
            {request.orderCode}
          </span>

          <span className="headline-5 text-gray-700">ราคารวม</span>
          <span className="text-[16px] text-utility-black font-normal">
            {request.totalPrice}
          </span>

          <span className="headline-5 text-gray-700">สถานที่</span>
          <div>
            <p className="text-[16px] text-utility-black font-normal">
              {request.address}
            </p>
            <button className="flex items-center gap-1 text-blue-600 text-[16px] font-semibold mt-1 hover:underline">
              <MapPin size={16} />
              ดูแผนที่
            </button>
          </div>
        </div>

        {/* Action Buttons
            mobile  → flex-row เต็มความกว้าง
            sm+     → flex-col ชิดขวา ปุ่มไม่ยืด */}
        <div className="flex  gap-3 sm:shrink-0">
          <button
            onClick={() => onReject(request.id)}
            className="flex-1 sm:flex-none px-6 py-2 rounded-lg border border-blue-600 text-blue-600 text-[14px] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            ปฏิเสธ
          </button>
          <button
            onClick={() => onAccept(request)}
            className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-blue-600 text-white text-[14px] font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            รับงาน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestCard;
