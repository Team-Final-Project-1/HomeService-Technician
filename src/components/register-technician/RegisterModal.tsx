import { useRouter } from "next/router";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface RegisterModalProps {
  type: "success" | "error";
  errorMessage?: string;
  onClose: () => void;
}

export default function RegisterModal({
  type,
  errorMessage,
  onClose,
}: RegisterModalProps) {
  const router = useRouter();

  const isSuccess = type === "success";

  const handleGoToLogin = () => {
    router.push("/login-technician");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl px-8 py-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isSuccess ? "bg-green-50" : "bg-red-50"}`}
        >
          {isSuccess ? (
            <CheckCircle className="w-8 h-8 text-green-500" strokeWidth={1.8} />
          ) : (
            <XCircle className="w-8 h-8 text-red-500" strokeWidth={1.8} />
          )}
        </div>

        {/* Text */}
        <h2 className="text-[18px] font-bold text-gray-900 mb-2">
          {isSuccess ? "ลงทะเบียนสำเร็จ" : "ลงทะเบียนไม่สำเร็จ"}
        </h2>
        <p className="text-[13px] text-gray-400 leading-relaxed mb-6">
          {isSuccess
            ? "บัญชีของคุณถูกสร้างเรียบร้อยแล้ว\nกรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน"
            : "เกิดข้อผิดพลาดในการลงทะเบียน\nกรุณาลองใหม่อีกครั้ง"}
        </p>

        {/* Error message */}
        {!isSuccess && errorMessage && (
          <div className="w-full bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
            <p className="text-[12px] text-red-500">{errorMessage}</p>
          </div>
        )}

        {/* Button */}
        <button
          onClick={isSuccess ? handleGoToLogin : onClose}
          className={`w-full h-11 rounded-xl text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            isSuccess
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-900 hover:bg-gray-800 text-white"
          }`}
        >
          {isSuccess ? (
            <>
              ไปยังหน้าเข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" /> กลับไปลงทะเบียน
            </>
          )}
        </button>
      </div>
    </div>
  );
}
