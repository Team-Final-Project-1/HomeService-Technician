import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticationRoute from "@/components/auth/AuthenticationRoute";
import RegisterModal from "@/components/register-technician/RegisterModal";
import {
  Loader2,
  Wrench,
  User,
  Phone,
  Mail,
  Lock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface FormErrors {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  accept: string;
}

const initialErrors: FormErrors = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  password: "",
  accept: "",
};

export default function RegisterTechnicianPage() {
  const { register, state, isAuthenticated } = useAuth();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [accept, setAccept] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [apiError, setApiError] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: FormErrors = { ...initialErrors };
    let valid = true;

    const nameRegex = /^[A-Za-zก-๙\s'-]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      newErrors.first_name = "โปรดกรอกชื่อ";
      valid = false;
    } else if (!nameRegex.test(firstName)) {
      newErrors.first_name = "ชื่อใช้ได้เฉพาะ A-Z a-z ภาษาไทย ' -";
      valid = false;
    }
    if (!lastName.trim()) {
      newErrors.last_name = "โปรดกรอกนามสกุล";
      valid = false;
    } else if (!nameRegex.test(lastName)) {
      newErrors.last_name = "นามสกุลใช้ได้เฉพาะ A-Z a-z ภาษาไทย ' -";
      valid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = "โปรดกรอกเบอร์โทรศัพท์";
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "เบอร์โทรต้องเป็นตัวเลข 10 หลัก";
      valid = false;
    }
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
    if (!accept) {
      newErrors.accept = "กรุณายอมรับข้อตกลงและเงื่อนไข";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (state.loading) return;
    if (!validate()) return;

    const result = await register({
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      password,
    });

    if (result?.error) {
      setApiError(result.error);
      setModalType("error");
    } else {
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
        <RegisterModal
          type={modalType}
          errorMessage={apiError}
          onClose={handleCloseModal}
        />
      )}

      <div className="min-h-screen bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400 opacity-10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
          {/* ===== LEFT PANEL ===== */}
          <div className="w-full lg:w-105 lg:min-h-screen shrink-0 flex flex-col px-6 pt-8 pb-6 lg:px-10 lg:py-12 lg:justify-evenly">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-[20px] lg:text-[28px] leading-none">
                  HomeServices
                </p>
                <p className="text-blue-300 text-[16px] mt-0.5">
                  ระบบจัดการงานช่าง
                </p>
              </div>
            </div>

            {/* Hero — ซ่อนบน mobile เล็กมาก แสดงตั้งแต่ sm ขึ้นไป */}
            <div className="mt-8 lg:-mt-5">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 mb-4">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-200 text-[12px]">
                  เปิดรับช่างใหม่ทุกสาขา
                </span>
              </div>
              <h2 className="text-white text-[26px] lg:text-[30px] font-bold leading-tight mb-3">
                3 ขั้นตอน
                <br />
                <span className="text-sky-300">เริ่มรับงานได้เลย</span>
              </h2>
              <p className="text-blue-200 text-[13px] leading-relaxed mb-6 max-w-xs">
                สมัครง่าย ใช้เวลาไม่ถึง 2 นาที
                แล้วเริ่มรับงานในพื้นที่ของคุณได้ทันที
              </p>

              {/* Steps — horizontal บน mobile, vertical บน desktop */}
              <div className="flex flex-row lg:flex-col gap-3 lg:gap-5">
                {[
                  {
                    step: "01",
                    title: "กรอกข้อมูลส่วนตัว",
                    desc: "ชื่อ เบอร์โทร และอีเมล",
                  },
                  {
                    step: "02",
                    title: "รอการยืนยันตัวตน",
                    desc: "ระบบตรวจสอบข้อมูลและยืนยันตัวตน",
                  },
                  {
                    step: "03",
                    title: "เริ่มรับงาน",
                    desc: "ตั้งค่าโปรไฟล์รับงานได้เลย",
                  },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    className="flex-1 lg:flex-none flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-4"
                  >
                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                      <span className="text-sky-300 text-[11px] font-bold">
                        {item.step}
                      </span>
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="text-white text-[12px] lg:text-[14px] font-semibold">
                        {item.title}
                      </p>
                      <p className="text-blue-300 text-[11px] lg:text-[12px] mt-0.5 hidden sm:block">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security badge — ซ่อนบน mobile เล็กสุด */}
            <div className="hidden sm:flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-4 py-3 mt-6 lg:mt-0">
              <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
              <p className="text-blue-200 text-[12px] leading-relaxed">
                ข้อมูลของคุณได้รับการเข้ารหัสและปลอดภัย 100%
              </p>
            </div>
          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div className="flex-1 bg-[#F6F7FB] rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none flex items-start justify-center px-4 py-8 lg:py-12 overflow-y-auto">
            <div className="w-full max-w-115">
              {/* Card header */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[12px] font-medium px-3 py-1 rounded-full">
                  <Wrench className="w-3 h-3" />
                  สมัครเป็นช่าง
                </span>
                <h1 className="text-[22px] font-bold text-gray-900 mt-3">
                  สร้างบัญชีช่างของคุณ
                </h1>
                <p className="text-[13px] text-gray-500 mt-1">
                  กรอกข้อมูลด้านล่างเพื่อเริ่มต้นรับงาน
                </p>
              </div>

              {/* Form card */}
              <div className="bg-white border border-[#E4E7EC] rounded-2xl px-6 py-8 shadow-sm">
                <form className="space-y-4" onSubmit={handleRegister}>
                  {/* FIRST + LAST NAME */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                        ชื่อ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="ชื่อ"
                          value={firstName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFirstName(e.target.value)
                          }
                          className="w-full h-11 pl-9 pr-3 text-[14px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      {errors.first_name && (
                        <p className="text-[12px] text-red-500 mt-1">
                          {errors.first_name}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                        นามสกุล <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="นามสกุล"
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setLastName(e.target.value)
                        }
                        className="w-full h-11 px-3 text-[14px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      {errors.last_name && (
                        <p className="text-[12px] text-red-500 mt-1">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                      เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="0XX-XXX-XXXX"
                        value={phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPhone(e.target.value)
                        }
                        className="w-full h-11 pl-10 pr-4 text-[14px] bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[12px] text-red-500 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                      อีเมล <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="กรุณากรอกอีเมล"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                        placeholder="อย่างน้อย 8 ตัวอักษร"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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

                  {/* CHECKBOX */}
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accept}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setAccept(e.target.checked)
                        }
                        className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
                      />
                      <span className="text-[13px] text-gray-500 leading-relaxed">
                        ยอมรับ{" "}
                        <span className="text-blue-600 underline cursor-pointer">
                          ข้อตกลงและเงื่อนไข
                        </span>{" "}
                        และ{" "}
                        <span className="text-blue-600 underline cursor-pointer">
                          นโยบายความเป็นส่วนตัว
                        </span>
                      </span>
                    </label>
                    {errors.accept && (
                      <p className="text-[12px] text-red-500 mt-1">
                        {errors.accept}
                      </p>
                    )}
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={state.loading ?? false}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[14px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200 cursor-pointer mt-2"
                  >
                    {state.loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        กำลังสมัคร...
                      </>
                    ) : (
                      <>
                        สร้างบัญชี
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="border-t border-gray-100 mt-6 pt-5 text-center">
                  <p className="text-[13px] text-gray-500">
                    มีบัญชีอยู่แล้ว?{" "}
                    <Link
                      href="/login-technician"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      เข้าสู่ระบบ
                    </Link>
                  </p>
                </div>
              </div>

              {/* Benefits — แสดงใต้ form บน mobile */}
              <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
                {[
                  "รับงานใกล้บ้านแบบเรียลไทม์",
                  "รายได้ยืดหยุ่น ทำเมื่อไหร่ก็ได้",
                  "ระบบชำระเงินปลอดภัย",
                  "ซัพพอร์ต 24 ชม.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 bg-white/60 border border-white rounded-xl px-3 py-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <p className="text-[12px] text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticationRoute>
  );
}
