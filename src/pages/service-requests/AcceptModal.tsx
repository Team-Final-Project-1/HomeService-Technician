import { X, Mail } from "lucide-react";
import { ServiceRequest } from "./ServiceRequestCard";
import { Spinner } from "@/components/ui/spinner";

interface AcceptModalProps {
  request: ServiceRequest;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming: boolean;
}

const AcceptModal = ({
  request,
  onConfirm,
  onCancel,
  isConfirming,
}: AcceptModalProps) => {
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
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail size={28} className="text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[18px] font-semibold text-gray-900 mb-3">
          ยืนยันการรับงาน?
        </h2>

        {/* Description */}
        <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
          คุณสามารถให้บริการ &lsquo;{request.serviceName}&rsquo; ในวันที่ <br />
          {request.date} เวลา {request.time}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-blue-600 text-blue-600 text-[15px] font-medium hover:bg-blue-50 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-[15px] font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center"
          >
            {isConfirming ? (
              <Spinner className="w-5 h-5 text-white" />
            ) : (
              "ยืนยัน"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptModal;
