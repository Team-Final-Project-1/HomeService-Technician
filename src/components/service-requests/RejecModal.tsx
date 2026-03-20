import { X, AlertCircle } from "lucide-react";
import { ServiceRequest } from "@/components/service-requests/ServiceRequestCard";
import { Spinner } from "@/components/ui/spinner";

interface RejectModalProps {
  request: ServiceRequest;
  onConfirm: () => void;
  onCancel: () => void;
  isRejecting: boolean;
}

const RejectModal = ({
  request,
  onConfirm,
  onCancel,
  isRejecting,
}: RejectModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-prompt">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm relative shadow-xl text-center">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={28} className="text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[18px] font-semibold text-gray-900 mb-3">
          ยืนยันการปฏิเสธงาน?
        </h2>

        {/* Description */}
        <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
          คุณต้องการปฏิเสธงาน &lsquo;{request.serviceName}&rsquo; <br />
          ของคุณ {request.customer_name} ใช่หรือไม่?
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 text-[15px] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            disabled={isRejecting}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white text-[15px] font-medium hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center"
          >
            {isRejecting ? (
              <Spinner className="w-5 h-5 text-white" />
            ) : (
              "ปฏิเสธ"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
