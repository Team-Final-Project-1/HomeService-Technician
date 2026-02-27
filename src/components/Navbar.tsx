import { useState } from "react";
import { useRouter } from "next/router";
import {
  Bell,
  ClipboardList,
  History,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const SIDEBAR_WIDTH = 270;

  const menuItem =
    "flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-[#E6F0FF] hover:text-[#001C59]";

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="fixed top-0 left-0 w-full h-14 bg-[#001C59] flex items-center justify-between px-4 z-40 md:pl-[270px]">

        {/* MOBILE LOGO */}
        <div
          onClick={() => router.push("/")}
          className="flex md:hidden items-center gap-2 bg-[#E6F0FF] px-3 py-1.5 rounded-md cursor-pointer"
        >
          <img src="/house 1.png" className="h-5 w-5" />
          <span className="text-[#336DF2] text-sm font-semibold">
            HomeServices
          </span>
        </div>

        {/* HAMBURGER */}
        <button
          onClick={() => setOpen(true)}
          className="flex md:hidden flex-col gap-1"
        >
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
        </button>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        style={{ width: SIDEBAR_WIDTH }}
        className={`
          fixed top-0 h-screen
          bg-[#001C59]
          z-50
          flex flex-col
          transition-transform duration-300

          /* ---------- MOBILE (RIGHT DRAWER) ---------- */
          right-0
          ${open ? "translate-x-0" : "translate-x-full"}

          /* ---------- DESKTOP (LEFT FIXED) ---------- */
          md:left-0
          md:right-auto
          md:translate-x-0
        `}
      >
        {/* ===== DESKTOP LOGO ===== */}
        <div className="hidden md:flex items-center gap-2 p-4">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-[#E6F0FF] px-3 py-1.5 rounded-md cursor-pointer"
          >
            <img src="/house 1.png" className="h-5 w-5" />
            <span className="text-[#336DF2] text-sm font-semibold">
              HomeServices
            </span>
          </div>
        </div>

        {/* ===== MOBILE CLOSE BUTTON ===== */}
        <div className="flex md:hidden justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            className="text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* ===== MENU ===== */}
        <div className="flex flex-col gap-2 px-4 text-white mt-4">

          <div className={`${menuItem} justify-between`}>
            <div className="flex items-center gap-4">
              <Bell size={22} />
              <span>คำขอบริการซ่อม</span>
            </div>

            <div className="bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              3
            </div>
          </div>

          <div className={menuItem}>
            <ClipboardList size={22} />
            <span>รายการที่รอดำเนินการ</span>
          </div>

          <div className={menuItem}>
            <History size={22} />
            <span>ประวัติการซ่อม</span>
          </div>

          <div className={menuItem}>
            <User size={22} />
            <span>ตั้งค่าบัญชีผู้ใช้</span>
          </div>
        </div>

        {/* ===== LOGOUT ===== */}
        <div className="mt-auto px-4 pb-8 text-white">
          <div className={menuItem}>
            <LogOut size={22} />
            <span>ออกจากระบบ</span>
          </div>
        </div>
      </div>
    </>
  );
}