import { FC } from "react";
import { TrendingUp, Star, Clock, Wrench } from "lucide-react";

type TechnicianDashboardStats = {
  total_completed: number;
  total_in_progress: number;
  total_pending: number;
  avg_rating: number | null;
  total_hours: number;
  completion_rate: number;
  this_month_completed: number;
  last_month_completed: number;
};

type Props = {
  stats: TechnicianDashboardStats;
  completionPercent: number;
};

export const DashboardSummaryCards: FC<Props> = ({
  stats,
  completionPercent,
}) => {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] text-gray-500">งานที่สำเร็จแล้ว</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50">
            <Wrench className="h-4 w-4 text-green-600" />
          </div>
        </div>
        <p className="text-[24px] font-bold text-gray-900">
          {stats.total_completed}
        </p>
        <p className="mt-1 text-[12px] text-gray-500">
          งานทั้งหมดที่คุณทำสำเร็จในระบบ
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] text-gray-500">อัตราสำเร็จของงาน</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
        </div>
        <p className="text-[24px] font-bold text-gray-900">
          {completionPercent}%
        </p>
        <p className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <span
            className="block h-2 rounded-full bg-blue-500 transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </p>
        <p className="mt-1 text-[12px] text-gray-500">
          คำนวณจากงานสำเร็จเทียบกับงานทั้งหมดของคุณ
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] text-gray-500">คะแนนรีวิวเฉลี่ย</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-50">
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
        <p className="text-[24px] font-bold text-gray-900">
          {stats.avg_rating ? stats.avg_rating.toFixed(1) : "-"}
        </p>
        <p className="mt-1 text-[12px] text-gray-500">
          จากคะแนนความพึงพอใจของลูกค้า (เต็ม 5)
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] text-gray-500">
            ชั่วโมงการทำงานโดยประมาณ
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50">
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
        </div>
        <p className="text-[24px] font-bold text-gray-900">
          {(stats.total_hours ?? 0).toFixed(2)}
        </p>
        <p className="mt-1 text-[12px] text-gray-500">
          เวลาที่ใช้ในการทำงานซ่อมทั้งหมด (ชั่วโมง)
        </p>
      </div>
    </div>
  );
};

