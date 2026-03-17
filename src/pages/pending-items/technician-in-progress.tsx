import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import StatusBadge from "@/components/StatusBadge";
import api from "@/lib/api";

export default function TechnicianInProgress() {

  const router = useRouter();

  const [jobs, setJobs] = useState<any[]>([]);

  // ================= FETCH API =================
  useEffect(() => {

    const fetchJobs = async () => {
      try {

        const res = await api.get("/technician-pending/in-progress");
        
        const formatted = res.data.map((job: any) => ({
          id: job.id,
          service: job.services?.[0] || "-",
          appointment_date: new Date(job.created_at).toLocaleString("th-TH"),
          order_code: `AD${String(job.id).padStart(8, "0")}`,
          price: job.total_price,
          status: job.status,
        }));

        setJobs(formatted);

      } catch (error) {
        console.error("Error fetching in-progress jobs:", error);
      }
    };

    fetchJobs();

  }, []);

  return (
    <TechnicianLayout>

      <div className="p-6">

        <h1 className="text-xl font-semibold mb-6">
          งานที่กำลังดำเนินการ
        </h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

          <table className="w-full text-sm table-fixed">

            <thead className="bg-[#F1F5F9] text-gray-700 font-semibold">
              <tr>
                <th className="p-4 text-left">บริการ</th>
                <th className="p-4 text-left">วันนัดหมาย</th>
                <th className="p-4 text-left">รหัสงาน</th>
                <th className="p-4 text-left">ราคา</th>
                <th className="p-4 text-left">สถานะ</th>
                <th className="p-4 text-center w-[90px]">Action</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-t hover:bg-blue-50 transition"
                >
                  <td className="p-4 font-medium text-gray-900">
                    {job.service}
                  </td>

                  <td className="p-4 text-gray-600">
                    {job.appointment_date}
                  </td>

                  <td className="p-4 text-gray-500">
                    {job.order_code}
                  </td>

                  <td className="p-4 font-semibold text-blue-600">
                    {job.price} ฿
                  </td>

                  <td className="p-4">
                    <StatusBadge status={job.status} />
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        router.push(`/technician-job/${job.id}`)
                      }
                      className="
                        w-9 h-9
                        flex items-center justify-center
                        border border-gray-300
                        rounded-md
                        cursor-pointer
                        text-gray-600
                        hover:bg-[#336DF2]
                        hover:text-white
                        transition
                      "
                    >
                      ดู
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </TechnicianLayout>
  );
}