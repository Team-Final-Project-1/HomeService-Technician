import { MapPin, Phone, User, FileText } from "lucide-react";

export interface ServiceRequest {
  id: number;
  order_code: string;
  net_price: number;
  appointment_date: string;
  appointment_time: string;
  address: string;
  distance_km: number;
  service_names: string[];
  item_names: string[];
  customer_lat: number | null;
  customer_lng: number | null;
  remark: string | null;
  customer_name: string;
  customer_phone: string;
  // computed fields
  serviceName: string;
  date: string;
  time: string;
  items: string;
  orderCode: string;
  totalPrice: string;
}

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onAccept: (request: ServiceRequest) => void;
  onReject: (request: ServiceRequest) => void;
  onViewMap: (request: ServiceRequest) => void;
}

const ServiceRequestCard = ({
  request,
  onAccept,
  onReject,
  onViewMap,
}: ServiceRequestCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-300 p-5 font-prompt overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
        <h3 className="text-[20px] font-medium text-black mb-2 sm:mb-0">
          {request.serviceName}
        </h3>
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

          <span className="headline-5 text-gray-700">ลูกค้า</span>
          <div className="flex items-center gap-1.5">
            <User size={15} className="text-gray-400 shrink-0" />
            <span className="text-[16px] text-utility-black font-normal">
              คุณ {request.customer_name}
            </span>
          </div>

          <span className="headline-5 text-gray-700">เบอร์ติดต่อ</span>
          <div className="flex items-center gap-1.5">
            <Phone size={15} className="text-gray-400 shrink-0" />
            <span className="text-[16px] text-utility-black font-normal">
              {request.customer_phone}
            </span>
          </div>

          <span className="headline-5 text-gray-700">สถานที่</span>
          <div>
            <p className="text-[16px] text-utility-black font-normal">
              {request.address}
            </p>
            <button
              onClick={() => onViewMap(request)}
              className="flex items-center gap-1 text-blue-600 text-[16px] font-semibold mt-1 hover:underline cursor-pointer"
            >
              <MapPin size={16} />
              ดูแผนที่
            </button>
          </div>

          {request.remark && (
            <>
              <span className="headline-5 text-gray-700">หมายเหตุ</span>
              <div className="flex items-start gap-1.5">
                <FileText size={15} className="text-gray-400 shrink-0 mt-1" />
                <span className="text-[16px] text-utility-black font-normal">
                  {request.remark}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sm:shrink-0">
          <button
            onClick={() => onReject(request)}
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
