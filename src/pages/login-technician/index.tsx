import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticationRoute from "@/components/auth/AuthenticationRoute";
import LoginModal from "@/components/login-technician/LoginModal";
import { Loader2, Wrench, Mail, Lock, ChevronRight, Star } from "lucide-react";

interface FormErrors {
  email: string;
  password: string;
}

const initialErrors: FormErrors = {
  email: "",
  password: "",
};

export default function LoginTechnicianPage() {
  const { login, state, isAuthenticated, fetchUser } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [apiError, setApiError] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: FormErrors = { ...initialErrors };
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "โปรดกรอกอีเมล";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = "โปรดกรอกรหัสผ่าน";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (state.loading) return;
    if (!validate()) return;

    const result = await login({ email, password });

    if (result?.error) {
      setApiError(result.error);
      setModalType("error");
    } else {
      if (result?.role !== "technician") {
        localStorage.removeItem("token");
        await fetchUser();
        setApiError("บัญชีผู้ใช้ของคุณไม่ได้รับสิทธิ์เข้าใช้งานระบบช่าง");
        setModalType("error");
        return;
      }
      setModalType("success");
    }
  };

  const handleCloseModal = (): void => {
    setModalType(null);
    setApiError("");
  };

  return (
    <AuthenticationRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      bypassRedirect={modalType !== null}
    >
      {modalType && (
        <LoginModal
          type={modalType}
          errorMessage={apiError}
          onClose={handleCloseModal}
        />
      )}

      {/* Full-page background */}
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="w-full max-w-240 relative z-10 flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
          {/* ===== LEFT PANEL ===== */}
          <div className="lg:w-105 shrink-0 bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 p-10 flex flex-col justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-[16px] leading-none">
                  HomeServices
                </p>
                <p className="text-blue-300 text-[14px] mt-0.5">
                  ระบบจัดการงานช่าง
                </p>
              </div>
            </div>

            {/* Hero text */}
            <div className="py-10">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 mb-5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-200 text-[14px]">
                  พร้อมรับงานทั่วประเทศ
                </span>
              </div>
              <h2 className="text-white text-[32px] font-bold leading-tight mb-4">
                ระบบจัดการสำหรับ
                <br />
                <span className="text-sky-300">ช่างผู้ให้บริการ</span>
              </h2>
              <p className="text-blue-200 text-[14px] leading-relaxed">
                จัดการงานซ่อม รับคำขอบริการใหม่
                และติดตามประวัติการทำงานของคุณได้ในที่เดียว
              </p>
            </div>

            {/* Checklist card  */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 space-y-3 font-prompt">
              <p className="text-blue-200 text-[14px] font-medium mb-4">
                สิทธิประโยชน์ที่คุณจะได้รับเมื่อเข้าร่วมกับเรา
              </p>

              {[
                "รับงานซ่อมใกล้บ้านคุณแบบเรียลไทม์",
                "รายได้เสริมที่ยืดหยุ่น ทำเมื่อไหร่ก็ได้",
                "ระบบชำระเงินที่ปลอดภัยและรวดเร็ว",
                "สร้างโปรไฟล์และเพิ่มความน่าเชื่อถือ",
                "ทีมซัพพอร์ตพร้อมช่วยเหลือตลอด 24 ชม.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-400/20 border border-green-400/50 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-white text-[14px] leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div className="flex-1 bg-white flex flex-col justify-center px-8 py-10 sm:px-12">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-800 font-semibold">HomeServices</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[16px] font-medium px-3 py-1 rounded-full">
                <Wrench className="w-3 h-3" />
                เข้าสู่ระบบจัดการงานช่าง
              </span>
              <h1 className="text-[26px] font-bold text-gray-900 mt-3">
                ยินดีต้อนรับกลับ 👋
              </h1>
              <p className="text-[14px] text-gray-500 mt-1">
                กรอกข้อมูลเพื่อเข้าสู่ระบบจัดการงานช่างของคุณ
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* EMAIL */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="กรุณากรอกอีเมลของคุณ"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    className="w-full h-11 pl-10 pr-4 text-[14px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-[12px] text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  รหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="กรุณากรอกรหัสผ่านของคุณ"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    className="w-full h-11 pl-10 pr-4 text-[14px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                {errors.password && (
                  <p className="text-[12px] text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* FORGOT PASSWORD */}
              <div className="text-right -mt-2">
                <Link
                  href="/forgot-password"
                  className="text-[13px] text-blue-600 hover:underline"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={state.loading ?? false}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[14px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200 cursor-pointer"
              >
                {state.loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    เข้าสู่ระบบ
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-[13px] text-gray-500">
                ยังไม่ได้ลงทะเบียนร่วมงานกับเรา?{" "}
                <Link
                  href="/register-technician"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  สมัครเป็นช่าง
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthenticationRoute>
  );
}
