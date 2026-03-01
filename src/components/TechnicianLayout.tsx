import React from "react";
import { useRouter } from "next/router";
import Sidebar, { menuItems } from "./Sidebar";

interface TechnicianLayoutProps {
  children: React.ReactNode;
}

const TechnicianLayout: React.FC<TechnicianLayoutProps> = ({ children }) => {
  const router = useRouter();

  const pageTitle =
    menuItems.find((item) => item.path === router.pathname)?.name ??
    "HomeServices";

  return (
    <div className="flex h-screen overflow-hidden font-prompt bg-[#F6F7FB] ">
      <Sidebar />

      {/* Content wrapper */}
      {/* md:pl-[210px] เว้นที่ให้ sidebar desktop */}
      {/* pt-17 เว้นที่ให้ mobile top navbar */}
      <div className="flex-1 flex flex-col min-w-0 pt-17 md:pt-0 md:pl-65 md:w-full">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center h-16 bg-white border-b border-gray-200 px-8 shrink-0">
          <h1 className="text-[18px] font-semibold text-gray-900">
            {pageTitle}
          </h1>
        </header>

        {/* Mobile Header (ใต้ mobile navbar) */}
        <header className="flex md:hidden items-center h-20 bg-white border-b border-gray-200 px-5 shrink-0">
          <h1 className="text-[16px] font-semibold text-gray-900">
            {pageTitle}
          </h1>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-[#F6F7FB]">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default TechnicianLayout;
