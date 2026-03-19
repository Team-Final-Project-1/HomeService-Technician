import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import {toast} from "sonner"
import dynamic from "next/dynamic";

import {
  getJobDetail,
  completeJob,
} from "@/features/technician/pending/services/technician.api";

const MapView = dynamic(
  () => import("@/features/technician/pending/components/MapView"),
  { ssr: false }
);

export default function TechnicianJobDetail() {

  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // toggle map
  const [showMap, setShowMap] = useState(false);

  /* =========================================================
     FETCH JOB DETAIL
  ========================================================= */

  useEffect(() => {

    if (!id) return;

    const orderId = Array.isArray(id) ? id[0] : id;

    const fetchJob = async () => {

      try {

        const data = await getJobDetail(Number(orderId));

        if (!data) {
          toast.error("ไม่พบข้อมูลงาน");
          router.push("/pending-items");
          return;
        }

        const formatted = {

          id: data.id,

          service: data.service_names?.join(", ") || "-",

          appointment_date: data.appointment_datetime
            ? new Date(data.appointment_datetime).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-",

          order_code: data.order_code,

          price: data.net_price,

          status: data.service_status,

          address: data.address_line || "-",

          customer_name: data.customer_name || "-",

          phone: data.customer_phone || "-",

          // 
          lat: data.customer_lat ?? null,
          lng: data.customer_lng ?? null,

        };

        setJob(formatted);

      } catch (error) {

        console.error("Error fetching job:", error);
        toast.error("ไม่สามารถโหลดข้อมูลงานได้");

      } finally {

        setLoading(false);

      }

    };

    fetchJob();

  }, [id]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (
      <TechnicianLayout>
        <div className="p-6 text-gray-400">กำลังโหลด...</div>
      </TechnicianLayout>
    );

  }

  /* =========================================================
     COMPLETE JOB
  ========================================================= */

  const handleCompleteJob = async () => {

    try {

      await completeJob(Number(job.id));

      toast.success("งานเสร็จสิ้น");

      router.push("/history");

    } catch (error) {

      console.error("Complete job error:", error);
      toast.error("เกิดข้อผิดพลาด");

    }

  };

  return (

    <TechnicianLayout>

      <div className="p-6">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-gray-500 hover:text-black"
        >
          ← ย้อนกลับ
        </button>

        {/* TITLE */}
        <h1 className="text-xl font-semibold mb-6">
          {job.service}
        </h1>

        {/* JOB DETAIL */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">

          <Row label="หมวดหมู่" value="บริการซ่อม" />
          <Row label="รายการ" value={job.service} />
          <Row label="วันนัดหมาย" value={job.appointment_date} />

          {/* 🔥 LOCATION + BUTTON */}
          <div className="grid grid-cols-3 gap-4">

            <div className="text-gray-500">
              สถานที่
            </div>

            <div className="col-span-2 font-medium">

              <p>{job.address}</p>

              {/*  ปุ่มดูแผนที่ */}
              {job.lat && job.lng && (
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="text-blue-600 text-sm mt-1 hover:underline"
                >
                  {showMap ? "ซ่อนแผนที่" : "ดูแผนที่"}
                </button>
              )}

              {/* แสดง map เมื่อกด */}
              {showMap && job.lat && job.lng && (
                <div className="mt-3">
                  <MapView lat={job.lat} lng={job.lng} />
                </div>
              )}

            </div>

          </div>

          <Row label="รหัสคำสั่งซ่อม" value={job.order_code} />
          <Row label="ราคารวม" value={`${job.price?.toLocaleString()} ฿`} />
          <Row label="ผู้รับบริการ" value={job.customer_name} />
          <Row label="เบอร์ติดต่อ" value={job.phone} />

        </div>

        {/* ACTION */}
        {job.status === "in_progress" && (

          <div className="mt-6 flex justify-end">

            <button
              onClick={handleCompleteJob}
              className="
                bg-green-600
                text-white
                px-6 py-3
                rounded-lg
                hover:bg-green-700
                transition
              "
            >
              เสร็จงาน
            </button>

          </div>

        )}

      </div>

    </TechnicianLayout>

  );

}



/* =========================================================
   ROW COMPONENT
========================================================= */

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="grid grid-cols-3 gap-4">

      <div className="text-gray-500">
        {label}
      </div>

      <div className="col-span-2 font-medium">
        {value}
      </div>

    </div>

  );

}