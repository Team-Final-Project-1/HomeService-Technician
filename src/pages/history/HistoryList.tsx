import { Search, SquarePen, ChevronDown, MapPin } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const services = [
  "ทั้งหมด",
  "ล้างแอร์",
  "ติดตั้งแอร์",
  "ทำความสะอาดทั่วไป",
  "ซ่อมแอร์",
  "ซ่อมเครื่องซักผ้า",
  "ติดตั้งเครื่องดูดควัน",
  "ติดตั้งเครื่องทำน้ำอุ่น",
];

export interface HistoryOrder {
  orderId: string;
  service: string;
  date: string;
  price: string;
}

const mockHistory: HistoryOrder[] = [
  {
    service: "ล้างแอร์",
    date: "25/04/2563 เวลา 13.00 น.",
    orderId: "AD04071205",
    price: "1,550.00 ฿",
  },
  {
    service: "ทำความสะอาดทั่วไป",
    date: "25/04/2563 เวลา 13.00 น.",
    orderId: "AD04071205",
    price: "1,550.00 ฿",
  },
  {
    service: "ติดตั้งเครื่องดูดควัน",
    date: "25/04/2563 เวลา 13.00 น.",
    orderId: "AD04071205",
    price: "1,550.00 ฿",
  },
  {
    service: "ล้างแอร์",
    date: "25/04/2563 เวลา 13.00 น.",
    orderId: "AD04071205",
    price: "1,550.00 ฿",
  },
  {
    service: "ล้างแอร์",
    date: "25/04/2563 เวลา 13.00 น.",
    orderId: "AD04071205",
    price: "1,550.00 ฿",
  },
  {
    service: "ติดตั้งเครื่องทำน้ำอุ่น",
    date: "25/04/2563 เวลา 13.00 น.",
    orderId: "AD04071205",
    price: "1,550.00 ฿",
  },
  {
    service: "ติดตั้งเครื่องทำน้ำอุ่น",
    date: "25/04/2563 เวลา 13.00 น.",
    orderId: "AD04071205",
    price: "1,550.00 ฿",
  },
  {
    service: "ติดตั้งเครื่องทำน้ำอุ่น",
    date: "25/04/2563 เวลา 13.00 น.",
    orderId: "AD04071205",
    price: "1,550.00 ฿",
  },
  {
    service: "ติดตั้งเครื่องทำน้ำอุ่น",
    date: "25/04/2563 เวลา 13.00 น.",
    orderId: "AD04071205",
    price: "1,550.00 ฿",
  },
];

interface HistoryListProps {
  onViewDetail: (orderId: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ onViewDetail }) => {
  const [data, setData] = useState<HistoryOrder[]>(mockHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("ทั้งหมด");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter logic
  const filteredData = data.filter((item) => {
    const matchesSearch = 
      item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterValue === "ทั้งหมด" || item.service === filterValue;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Actions Row: Search Bar */}
      <div className="flex justify-end items-center">
        <div className="relative w-full max-w-[350px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ค้นหารายการคำสั่งซ่อม"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white body-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Selection Row */}
      <div className="flex items-center gap-4">
        <span className="text-gray-500 body-3 font-semibold">บริการ</span>
        <div className="relative inline-block w-64" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between bg-white border px-4 py-2.5 rounded-lg body-3 transition-all duration-200 outline-none
              ${isDropdownOpen ? "border-blue-500 ring-4 ring-blue-500/10 shadow-sm" : "border-gray-300 text-gray-700 hover:border-gray-400"}
            `}
          >
            <span className="font-medium text-gray-800">{filterValue}</span>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => {
                    setFilterValue(service);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 body-3 transition-colors duration-150
                    ${filterValue === service 
                      ? "text-blue-600 font-semibold" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                  `}
                >
                  {service}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Container (Desktop) */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#336DF2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-gray-500 font-medium text-[14px] uppercase tracking-wider">ชื่อบริการ</th>
              <th className="px-6 py-4 text-gray-500 font-medium text-[14px] uppercase tracking-wider">วันเวลาดำเนินการ</th>
              <th className="px-6 py-4 text-gray-500 font-medium text-[14px] uppercase tracking-wider">รหัสคำสั่งซ่อม</th>
              <th className="px-6 py-4 text-gray-500 font-medium text-[14px] uppercase tracking-wider">ราคารวม</th>
              <th className="px-6 py-4 text-gray-500 font-medium text-[14px] uppercase tracking-wider text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr 
                  key={index} 
                  onClick={() => onViewDetail(item.orderId)}
                  className="hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-6 py-5 text-gray-700 body-3">{item.service}</td>
                  <td className="px-6 py-5 text-gray-600 body-3">{item.date}</td>
                  <td className="px-6 py-5 text-gray-700 body-3">{item.orderId}</td>
                  <td className="px-6 py-5 text-gray-900 body-3 font-medium">{item.price}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 border border-blue-600 rounded-md inline-block">
                      <SquarePen size={16} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 body-3">
                  {isLoading ? "กำลังโหลดข้อมูล..." : "ไม่พบรายการที่ค้นหา"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card Layout (Mobile) */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div 
              key={index}
              onClick={() => onViewDetail(item.orderId)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 cursor-pointer active:bg-gray-50 transition-colors"
            >
              <h3 className="text-[18px] font-bold text-gray-900 leading-tight">
                {item.service}
              </h3>
              
              <div className="flex flex-col gap-1">
                <span className="text-[14px] text-gray-400 font-medium body-3">วันเวลาดำเนินการ</span>
                <span className="text-[16px] text-blue-600 font-semibold body-3">{item.date}</span>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-y-2.5 items-start">
                <span className="text-gray-500 text-[14px] font-medium body-3">รายการ</span>
                <span className="text-gray-800 text-[14px] font-medium body-3">
                  {item.service} 9,000 - 18,000 BTU...
                </span>

                <span className="text-gray-500 text-[14px] font-medium body-3">รหัสคำสั่งซ่อม</span>
                <span className="text-gray-800 text-[14px] font-medium body-3">{item.orderId}</span>

                <span className="text-gray-500 text-[14px] font-medium body-3">ราคารวม</span>
                <span className="text-gray-900 text-[14px] font-bold body-3">{item.price}</span>

                <span className="text-gray-500 text-[14px] font-medium body-3">สถานที่</span>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-800 text-[14px] font-medium body-3 leading-relaxed">
                    444/4 คอนโดศุภาลัย เสนานิคม จตุจักร กรุงเทพฯ
                  </span>
                  <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[13px]">
                    <MapPin size={14} fill="currentColor" fillOpacity={0.1} />
                    <span className="underline">ดูแผนที่</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-2.5 border border-blue-600 text-blue-600 font-bold rounded-lg text-[14px]">
                  ลบรายการ
                </button>
                <button className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-[14px]">
                  รายละเอียด
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400 body-3">
            {isLoading ? "กำลังโหลดข้อมูล..." : "ไม่พบรายการที่ค้นหา"}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;



