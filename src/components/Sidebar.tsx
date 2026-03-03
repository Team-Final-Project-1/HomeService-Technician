import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Bell,
  ClipboardList,
  History,
  User,
  LogOut,
  X,
  Menu,
} from "lucide-react";

export const SIDEBAR_WIDTH = 260;

export const menuItems = [
  {
    name: "คำขอบริการซ่อม",
    path: "/service-requests",
    icon: <Bell size={20} strokeWidth={1.5} />,
    badge: 3,
  },
  {
    name: "รายการที่รอดำเนินการ",
    path: "/pending-items",
    icon: <ClipboardList size={20} strokeWidth={1.5} />,
  },
  {
    name: "ประวัติการซ่อม",
    path: "/history",
    icon: <History size={20} strokeWidth={1.5} />,
  },
  {
    name: "ตั้งค่าบัญชีผู้ใช้",
    path: "/account-settings",
    icon: <User size={20} strokeWidth={1.5} />,
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <>
      {/* ===== MOBILE TOP NAVBAR ===== */}
      {/* สีน้ำเงินเข้ม, มี Logo ซ้าย + Hamburger ขวา — แสดงเฉพาะ mobile */}
      <div className="fixed top-0 left-0 w-full h-17 bg-blue-950 flex items-center justify-between px-5 md:hidden">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-md cursor-pointer"
        >
          <img src="/house 1.png" className="h-5 w-5" alt="logo" />
          <span className="text-[#336DF2] text-base font-semibold">
            HomeServices
          </span>
        </div>

        {/* Hamburger icon */}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col gap-1.5 p-1"
          aria-label="เปิดเมนู"
        >
          <Menu size={30} color="white" />
        </button>
      </div>

      {/* ===== MOBILE OVERLAY ===== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <div
        style={{ width: SIDEBAR_WIDTH }}
        className={`
          fixed top-0 h-screen bg-blue-950 z-50 flex flex-col
          transition-transform duration-300

          /* mobile: drawer จากขวา */
          right-0 ${open ? "translate-x-0" : "translate-x-full"}

          /* desktop: fixed ซ้าย เสมอ */
          md:left-0 md:right-auto md:translate-x-0
        `}
      >
        {/* Logo — desktop only */}
        <div className="hidden md:flex p-5 pb-8 px-10">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-blue-100 py-3 rounded-md cursor-pointer w-full justify-center"
          >
            <img src="/house 1.png" className="h-5 w-5" alt="logo" />
            <span className="text-[#336DF2] text-base font-semibold">
              HomeServices
            </span>
          </div>
        </div>

        {/* ปุ่มปิด X — mobile only */}
        <div className="flex md:hidden justify-start px-4 pt-7 pb-7">
          <button
            onClick={() => setOpen(false)}
            className="text-white"
            aria-label="ปิดเมนู"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 flex flex-col gap-5">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-7 py-4 transition-colors duration-200
                  ${
                    isActive
                      ? "bg-blue-900 text-gray-100"
                      : "text-gray-100 hover:bg-white/10"
                  }`}
              >
                <span className="shrink-0 pr-3">{item.icon}</span>
                <span className="flex-1 text-[16px] text-gray-100 font-medium">
                  {item.name}
                </span>
                {/* Badge แจ้งเตือน */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-[#C82438] text-white text-xs w-7 h-7 flex items-center justify-center rounded-full shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pb-8 pt-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 px-7 py-4 text-gray-100 hover:bg-white/10 transition-colors w-full cursor-pointer"
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span className="text-[16px] font-medium text-gray-100 pl-3">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
