import { FC } from "react";

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

type TechnicianTaskRank = {
  id: string;
  jobName: string;
  count: number;
};

type Props = {
  stats: TechnicianDashboardStats;
  isLoading: boolean;
  topTasks: TechnicianTaskRank[];
};

export const WorkStatusAndTopTasks: FC<Props> = ({
  stats,
  isLoading,
  topTasks,
}) => {
  const total =
    stats.total_pending + stats.total_in_progress + stats.total_completed;

  const percent = (part: number) =>
    total === 0 ? 0 : (part / total) * 100;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-[16px] font-semibold text-gray-900">
        สถานะงานของคุณตอนนี้
      </h2>
      <p className="mb-3 text-[13px] text-gray-500">
        ดูภาพรวมว่างานของคุณอยู่ในสถานะใดบ้าง
      </p>

      <div className="space-y-3 text-[13px]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            รอรับงาน
          </span>
          <span className="font-medium text-gray-900">
            {stats.total_pending} งาน
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            กำลังดำเนินการ
          </span>
          <span className="font-medium text-gray-900">
            {stats.total_in_progress} งาน
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            สำเร็จแล้ว
          </span>
          <span className="font-medium text-gray-900">
            {stats.total_completed} งาน
          </span>
        </div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="flex h-2 w-full">
          <span
            className="h-2 bg-blue-500"
            style={{ width: `${percent(stats.total_pending)}%` }}
          />
          <span
            className="h-2 bg-amber-500"
            style={{ width: `${percent(stats.total_in_progress)}%` }}
          />
          <span
            className="h-2 bg-emerald-500"
            style={{ width: `${percent(stats.total_completed)}%` }}
          />
        </div>
      </div>

      {isLoading && (
        <p className="mt-3 text-[12px] text-gray-400">
          กำลังโหลดข้อมูลภาพรวมผลงานของคุณ...
        </p>
      )}

      {/* Personal top tasks ranking (inside same box, below status) */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <h3 className="mb-2 text-[14px] font-semibold text-gray-900">
          อันดับประเภทงานของคุณ (TOP 5)
        </h3>
        <p className="mb-3 text-[12px] text-gray-500">
          อันดับประเภทงานตามจำนวนครั้งที่คุณทำสำเร็จ (รวมทั้งหมด)
        </p>

        <div className="space-y-2 text-[13px]">
          {!isLoading && topTasks.length === 0 && (
            <div className="rounded-xl bg-gray-50 px-3 py-3 text-[12px] text-gray-500">
              ยังไม่มีข้อมูลอันดับประเภทงาน (TOP 5)
            </div>
          )}
          {topTasks.map((task, index) => {
            const rank = index + 1;
            const rankStyles =
              rank === 1
                ? "bg-yellow-100 text-yellow-800"
                : rank === 2
                  ? "bg-gray-100 text-gray-800"
                  : rank === 3
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-50 text-blue-700";

            return (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold ${rankStyles}`}
                  >
                    {rank}
                  </div>
                  <div className="font-medium text-gray-900">
                    {task.jobName}
                  </div>
                </div>
                <div className="text-[11px] text-gray-500">
                  สำเร็จ {task.count} งาน
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

