import {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";

import { pendingJobs } from "../services/pending.mock";

type SortType = "nearest" | "latest";

type Props = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  service: string;
  setService: Dispatch<SetStateAction<string>>;
  sort: SortType;
  setSort: Dispatch<SetStateAction<SortType>>;
};

export default function PendingHeader({
  search,
  setSearch,
  service,
  setService,
  sort,
  setSort,
}: Props) {

  // ================= SERVICES =================
  const services = [
    "ทั้งหมด",
    ...Array.from(new Set(pendingJobs.map((job) => job.service))),
  ];

  // ================= SORT OPTIONS =================
  const SORT_OPTIONS: {
    label: string;
    value: SortType;
  }[] = [
    { label: "วันที่นัดหมายใกล้สุด", value: "nearest" },
    { label: "รายการล่าสุด", value: "latest" },
  ];

  // ================= DROPDOWN STATE =================
  const [openService, setOpenService] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const serviceRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // ✅ click outside close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!serviceRef.current?.contains(e.target as Node))
        setOpenService(false);

      if (!sortRef.current?.contains(e.target as Node))
        setOpenSort(false);
    };

    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="mb-6 flex flex-col gap-4">

      {/* ===== TITLE ===== */}
      <h1 className="text-2xl font-semibold text-gray-800">
        รายการที่รอดำเนินการ
      </h1>

      {/* ===== SEARCH + FILTER ===== */}
      <div className="flex flex-col gap-3 text-gray-800 md:flex-row md:items-center md:justify-between">

    {/* ================= SEARCH ================= */}
<div className="w-full md:w-[320px] relative">

{/* 🔍 ICON */}
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="
    w-5 h-5
    text-gray-400
    absolute
    left-3
    top-1/2
    -translate-y-1/2
    pointer-events-none
  "
>
  <path d="m21 21-4.34-4.34"/>
  <circle cx="11" cy="11" r="8"/>
</svg>

<input
  type="text"
  placeholder="ค้นหารายการที่ต้องซ่อม"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="
    w-full
    border border-gray-300
    rounded-lg
    pl-10
    pr-4
    py-3
    text-sm
    outline-none
    focus:ring-2
    focus:ring-[#336DF2]
  "
/>

</div>

        {/* ================= FILTER ================= */}
<div className="flex gap-3">

{/* ================= SERVICE DROPDOWN ================= */}
<div ref={serviceRef} className="relative w-[200px]">

  {/* ✅ LABEL (เพิ่มอย่างเดียว) */}
  <p className="text-xs text-gray-500 mb-1">
    บริการ
  </p>

  <div
    onClick={() => setOpenService(!openService)}
    className="
      bg-white
      border border-gray-300
      rounded-lg
      px-4 py-3
      flex justify-between items-center
      shadow-sm
      cursor-pointer
      hover:border-[#336DF2]
    "
  >
    {service}
    <span className={`transition ${openService ? "rotate-180" : ""}`}>
      ▼
    </span>
  </div>

  {openService && (
    <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      {services.map((item) => (
        <div
          key={item}
          onClick={() => {
            setService(item);
            setOpenService(false);
          }}
          className="px-4 py-3 cursor-pointer hover:bg-[#336DF2] hover:text-white transition"
        >
          {item}
        </div>
      ))}
    </div>
  )}
</div>

{/* ================= SORT DROPDOWN ================= */}
<div ref={sortRef} className="relative w-[220px]">

  {/* ✅ LABEL (เพิ่มอย่างเดียว) */}
  <p className="text-xs text-gray-500 mb-1">
    เรียงตาม
  </p>

  <div
    onClick={() => setOpenSort(!openSort)}
    className="
      bg-white
      border border-gray-300
      rounded-lg
      px-4 py-3
      flex justify-between items-center
      shadow-sm
      cursor-pointer
      hover:border-[#336DF2]
    "
  >
    {
      SORT_OPTIONS.find(
        (opt) => opt.value === sort
      )?.label
    }

    <span className={`transition ${openSort ? "rotate-180" : ""}`}>
      ▼
    </span>
  </div>

  {openSort && (
    <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {SORT_OPTIONS.map((opt) => (
        <div
          key={opt.value}
          onClick={() => {
            setSort(opt.value);
            setOpenSort(false);
          }}
          className="px-4 py-3 cursor-pointer hover:bg-[#336DF2] hover:text-white transition"
        >
          {opt.label}
        </div>
      ))}
    </div>
  )}
</div>

</div>
      </div>
    </div>
  );
}