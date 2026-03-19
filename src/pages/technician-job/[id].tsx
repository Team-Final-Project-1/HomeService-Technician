import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import {toast} from "sonner"
import dynamic from "next/dynamic";

import {
  getJobDetail,
  completeJob,
} from "@/features/technician/pending/services/technician.api"

import ChatBadge from "@/components/chat/ChatBadge"
import { useAuth } from "@/contexts/AuthContext"

const MapView = dynamic(
  () => import("@/features/technician/pending/components/MapView"),
  { ssr: false }
)

export default function TechnicianJobDetail() {

  const router = useRouter()
  const { id } = router.query

  const { state } = useAuth()

  const userId = state.user?.id ? String(state.user.id) : null

  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)

  // =========================
  //  รอ router พร้อมก่อน
  // =========================
  useEffect(() => {

    if (!router.isReady) return
    if (!id) return

    const orderId = Array.isArray(id) ? id[0] : id

    const fetchJob = async () => {

      try {

        const data = await getJobDetail(Number(orderId))

        if (!data) {
          toast.error("ไม่พบข้อมูลงาน")
          router.replace("/pending-items")
          return
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
          lat: data.customer_lat ?? null,
          lng: data.customer_lng ?? null,
        }

        setJob(formatted)

      } catch (error) {

        console.error("❌ Error fetching job:", error)
        toast.error("โหลดงานไม่สำเร็จ")
        router.replace("/pending-items")

      } finally {

        setLoading(false)

      }

    }

    fetchJob()

  }, [router.isReady, id])

  // =========================
  if (loading) {
    return (
      <TechnicianLayout>
        <div className="p-6 text-gray-400">กำลังโหลด...</div>
      </TechnicianLayout>
    )
  }

  if (!job) return null

  // =========================
  const handleCompleteJob = async () => {

    try {

      await completeJob(Number(job.id))

      toast.success("งานเสร็จสิ้น")

      router.push("/history")

    } catch (error) {

      console.error("❌ Complete job error:", error)
      toast.error("เกิดข้อผิดพลาด")

    }

  }

  // =========================
  return (
    <TechnicianLayout>

      <div className="p-6">

        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-gray-500 hover:text-black"
        >
          ← ย้อนกลับ
        </button>

        <h1 className="text-xl font-semibold mb-6">
          {job.service}
        </h1>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">

          <Row label="หมวดหมู่" value="บริการซ่อม" />
          <Row label="รายการ" value={job.service} />
          <Row label="วันนัดหมาย" value={job.appointment_date} />

          <div className="grid grid-cols-3 gap-4">
            <div className="text-gray-500">สถานที่</div>

            <div className="col-span-2 font-medium">
              <p>{job.address}</p>

              {job.lat && job.lng && (
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="text-blue-600 text-sm mt-1 hover:underline"
                >
                  {showMap ? "ซ่อนแผนที่" : "ดูแผนที่"}
                </button>
              )}

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

          {/* CHAT */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-gray-500">เบอร์ติดต่อ</div>

            <div className="col-span-2 font-medium flex items-center gap-2">
              <span>{job.phone}</span>

              {userId && job.status === "in_progress" && (
                <button
                  onClick={() => router.push(`/chat/${job.id}`)}
                  className="relative w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center shadow active:scale-95"
                >
                  💬

                  <div className="absolute -top-1 -right-1">
                    <ChatBadge
                      orderId={String(job.id)}
                      userId={userId}
                    />
                  </div>

                </button>
              )}
            </div>
          </div>

        </div>

        {job.status === "in_progress" && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCompleteJob}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              เสร็จงาน
            </button>
          </div>
        )}

      </div>

    </TechnicianLayout>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-gray-500">{label}</div>
      <div className="col-span-2 font-medium">{value}</div>
    </div>
  )
}