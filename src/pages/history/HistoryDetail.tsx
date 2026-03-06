import { ChevronLeft, MapPin, Star } from "lucide-react";
import React from "react";
import { HistoryDetailData } from "./history.types";



interface HistoryDetailProps {
  order: HistoryDetailData;
  onBack: () => void;
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({ order, onBack }) => {
  return (
    <div className="max-w-[1000px] mx-auto pb-10">
      {/* Page Secondary Header / Breadcrumbs */}
      <div className="flex items-center gap-5 mb-8">
        <button
          onClick={onBack}
          className="flex items-center justify-center p-2 hover:bg-gray-200/50 rounded-full transition-colors"
        >
          <ChevronLeft size={32} className="text-gray-400" strokeWidth={1.5} />
        </button>
        <div className="flex flex-col -gap-1">
          <span className="text-[14px] text-gray-400 font-medium body-3">ประวัติการซ่อม</span>
          <span className="text-[20px] font-semibold text-[#001C59]">{order.service}</span>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="flex flex-col gap-10">
          {/* Service Main Title */}
          <h2 className="text-[20px] font-semibold text-gray-900">{order.service}</h2>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-6 md:gap-y-8 items-start">
            <span className="text-gray-500 font-medium body-3">หมวดหมู่</span>
            <div>
              <span className="bg-[#E7EEFF] text-[#336DF2] text-[12px] px-3 py-1 rounded-md font-semibold">
                {order.category}
              </span>
            </div>

            <span className="text-gray-500 font-medium body-3">รายการ</span>
            <span className="text-gray-700 font-medium body-3 leading-relaxed">
              {order.items}
            </span>

            <span className="text-gray-500 font-medium body-3">วันเวลาดำเนินการ</span>
            <span className="text-gray-700 font-medium body-3">
              {order.date}
            </span>

            <span className="text-gray-500 font-medium body-3">สถานที่</span>
            <div className="flex flex-col gap-1.5">
              <span className="text-gray-700 font-medium body-3 leading-relaxed">
                {order.location}
              </span>
              <button className="flex items-center gap-1.5 text-[#336DF2] font-semibold text-[14px] hover:text-blue-700 transition-colors w-fit">
                <MapPin size={16} fill="currentColor" fillOpacity={0.1} />
                <span className="underline underline-offset-2">ดูแผนที่</span>
              </button>
            </div>

            <span className="text-gray-500 font-medium body-3">รหัสคำสั่งซ่อม</span>
            <span className="text-gray-700 font-medium body-3 text-uppercase">{order.orderId}</span>

            <span className="text-gray-500 font-medium body-3">ราคารวม</span>
            <span className="text-gray-900 font-semibold body-3">{order.price}</span>

            <span className="text-gray-500 font-medium body-3">ผู้รับบริการ</span>
            <span className="text-gray-700 font-medium body-3">{order.customerName}</span>

            <span className="text-gray-500 font-medium body-3">เบอร์ติดต่อ</span>
            <span className="text-gray-700 font-medium body-3">{order.phone}</span>
          </div>

          {/* Horizontal Divider */}
          <div className="border-t border-gray-100 w-full pt-4"></div>

          {/* Assessment / Feedback Section */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-6 items-start pb-4">
            <span className="text-gray-500 font-medium body-3">คะแนนความพึงพอใจ</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={20} 
                  className={star <= order.rating ? "fill-[#336DF2] text-[#336DF2]" : "text-[#336DF2]"} 
                />
              ))}
            </div>

            <span className="text-gray-500 font-medium body-3">ความคิดเห็นจากผู้รับบริการ</span>
            <span className="text-gray-700 font-medium body-3 leading-relaxed">
              {order.feedback}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
