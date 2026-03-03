import React from "react";
import { useRouter } from "next/router";
import Sidebar, { menuItems } from "./Sidebar";

interface TechnicianLayoutProps {
  children: React.ReactNode;

  // ✅ allow page inject header actions (เช่น ปุ่ม Save / Cancel)
  headerActions?: React.ReactNode;
}

const TechnicianLayout: React.FC<TechnicianLayoutProps> = ({
  children,
  headerActions,
}) => {
  const router = useRouter();

  const pageTitle =
    menuItems.find((item) => item.path === router.pathname)?.name ??
    "HomeServices";

  return (
    <div className="flex h-screen overflow-hidden font-prompt bg-[#F6F7FB] ">
      <Sidebar />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 pt-17 md:pt-0 md:pl-65 md:w-full">
        
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between h-16 bg-white border-b border-gray-200 px-8 shrink-0">
          
          <h1 className="text-[18px] font-semibold text-gray-900">
            {pageTitle}
          </h1>

          {/* ✅ injected actions */}
          {headerActions && (
            <div className="flex gap-3">
              {headerActions}
            </div>
          )}

        </header>

        {/* Mobile Header (ใต้ mobile navbar) */}
        <header className="flex md:hidden items-center justify-between h-20 bg-white border-b border-gray-200 px-5 shrink-0">

          <h1 className="text-[16px] font-semibold text-gray-900">
          {pageTitle}
          </h1>

          {headerActions && (
          <div className="flex gap-2">
            {headerActions}
          </div>
)}

</header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-[#F3F4F6]">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default TechnicianLayout;