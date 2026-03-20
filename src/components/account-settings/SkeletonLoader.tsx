import TechnicianLayout from "@/components/layout/TechnicianLayout";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonLoader = () => {
  return (
    <>
      <TechnicianLayout headerActions={null}>
        <div className="w-full font-prompt">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 space-y-8">
            {/* Skeleton ส่วน section header */}
            <Skeleton className="h-6 w-36" />

            {/* Skeleton ส่วน form — จำลอง 4 row (ชื่อ/นามสกุล/เบอร์/ตำแหน่ง) */}
            <div className="flex flex-col gap-7">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-5 w-24 shrink-0" /> {/* label */}
                  <Skeleton className="flex-1 h-11 rounded-lg" /> {/* input */}
                </div>
              ))}
              {/* Row ตำแหน่ง — สูงกว่าปกติเพราะ text อาจหลายบรรทัด */}
              <div className="flex items-start gap-4">
                <Skeleton className="h-5 w-28 shrink-0 mt-2" />
                <Skeleton className="flex-1 h-16 rounded-lg" />
              </div>
            </div>

            <hr />

            {/* Skeleton ส่วนสถานะบัญชี */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-11 rounded-full" /> {/* toggle */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" /> {/* ชื่อ */}
                <Skeleton className="h-4 w-64" /> {/* คำอธิบาย */}
              </div>
            </div>

            <hr />

            {/* Skeleton ส่วนบริการที่รับซ่อม */}
            <Skeleton className="h-6 w-36" />
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" /> {/* checkbox */}
                  <Skeleton className="h-5 w-28" /> {/* ชื่อบริการ */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </TechnicianLayout>
    </>
  );
};

export default SkeletonLoader;
