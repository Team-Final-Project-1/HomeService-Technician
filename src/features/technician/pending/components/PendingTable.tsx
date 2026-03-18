import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { getPendingJobs } from "@/features/technician/pending/services/technician.api";

type SortType = "nearest" | "latest";

type Props = {
  search: string;
  service: string;
  sort: SortType;
};

type Job = {
  id: number;
  service_names: string[];
  service_text: string;
  appointment_datetime: string; 
  order_code: string;
  price: number;
  status: "pending" | "in_progress" | "completed";
};

export default function PendingTable({
  search,
  service,
  sort,
}: Props) {

  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH API ================= */

  useEffect(() => {

    const fetchJobs = async () => {

      try {

        const data = await getPendingJobs();

        const formatted: Job[] = data.map((job: any) => {

          return {
            id: job.id,
            service_names: job.service_names || [],
            service_text: job.service_names?.join(", ") || "-",
            appointment_datetime: job.appointment_datetime,
            order_code: job.order_code,
            price: job.net_price,
            status: job.service_status
          };

        });


        setJobs(formatted);

      } catch (error) {

        console.error("Error fetching pending jobs:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchJobs();

  }, []);

  /* ================= FILTER ================= */

  let filteredJobs = jobs.filter((job) =>
    job.service_text.toLowerCase().includes(search.toLowerCase())
  );

  if (service !== "ทั้งหมด" && service !== "all") {

    filteredJobs = filteredJobs.filter((job) =>
      job.service_names.includes(service)
    );

  }

  /* ================= SORT ================= */

  if (sort === "nearest") {

    filteredJobs = [...filteredJobs].sort(
      (a, b) =>
        new Date(a.appointment_datetime).getTime() -
        new Date(b.appointment_datetime).getTime()
    );

  }

  if (sort === "latest") {

    filteredJobs = [...filteredJobs].sort(
      (a, b) =>
        new Date(b.appointment_datetime).getTime() -
        new Date(a.appointment_datetime).getTime()
    );

  }

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="p-10 text-center text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
    );

  }

  /* ================= EMPTY ================= */

  if (filteredJobs.length === 0) {

    return (
      <div className="p-10 text-center text-gray-400">
        ไม่มีงานในขณะนี้
      </div>
    );

  }

  return (

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

          {filteredJobs.map((job) => (

            <tr
              key={job.id}
              className="border-t hover:bg-blue-50 transition"
            >

              <td className="p-4 font-medium text-gray-900 break-all">
                {job.service_text}
              </td>

              <td className="p-4 text-gray-600">
                {job.appointment_datetime
                  ? new Date(job.appointment_datetime).toLocaleString("th-TH")
                  : "-"}
              </td>

              <td className="p-4 text-gray-500 break-all">
                {job.order_code}
              </td>

              <td className="p-4 font-semibold text-blue-600">
                {job.price?.toLocaleString()} ฿
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

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                  </svg>

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}