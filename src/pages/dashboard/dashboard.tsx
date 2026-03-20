import { useEffect, useState } from "react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { LayoutDashboard } from "lucide-react";
import { DashboardSummaryCards } from "@/components/dashboard/DashboardSummaryCards";
import { PerformanceChartSection } from "@/components/dashboard/PerformanceChartSection";
import { WorkStatusAndTopTasks } from "@/components/dashboard/WorkStatusAndTopTasks";

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

const defaultStats: TechnicianDashboardStats = {
  total_completed: 0,
  total_in_progress: 0,
  total_pending: 0,
  avg_rating: null,
  total_hours: 0,
  completion_rate: 0,
  this_month_completed: 0,
  last_month_completed: 0,
};

type PerformancePoint = {
  label: string;
  value: number;
};

type TechnicianTaskRank = {
  id: string;
  jobName: string;
  count: number;
};

type TechnicianDashboardResponse = TechnicianDashboardStats & {
  performance_raw?: Array<{ date: string; value: number }>;
  top_tasks?: TechnicianTaskRank[];
};

type DatePreset = "7d" | "30d" | "thisMonth" | "custom";

const TechnicianDashboardPage = () => {
  const { state, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<TechnicianDashboardStats>(defaultStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [series, setSeries] = useState<PerformancePoint[]>([]);
  const [datePreset, setDatePreset] = useState<DatePreset>("30d");
  const [topTasks, setTopTasks] = useState<TechnicianTaskRank[]>([]);
  const [performanceRaw, setPerformanceRaw] = useState<
    Array<{ date: string; value: number }>
  >([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        // baseURL comes from `NEXT_PUBLIC_API_URL` via `src/lib/api.ts`
        // -> final URL: /api/technician-dashboard
        const res = await api.get<TechnicianDashboardResponse>(
          "/technician-dashboard",
        );

        const data = res.data || ({} as TechnicianDashboardResponse);

        setStats({
          ...defaultStats,
          ...data,
        });
        setTopTasks(Array.isArray(data.top_tasks) ? data.top_tasks : []);
        setPerformanceRaw(
          Array.isArray(data.performance_raw) ? data.performance_raw : [],
        );
      } catch (error) {
        console.error("Failed to fetch technician dashboard:", error);
        setStats(defaultStats);
        setTopTasks([]);
        setPerformanceRaw([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const name = state.user?.full_name ?? "ช่างผู้ให้บริการ";
  const roleLabel = "Technician Dashboard";

  const completionPercent = Math.min(
    100,
    Math.max(0, Math.round(stats.completion_rate)),
  );

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const currentSeries = series;

  // ตั้งค่า start/end date ตาม preset (อิงจากวันที่ล่าสุดใน performanceRaw)
  useEffect(() => {
    if (datePreset === "custom" || performanceRaw.length === 0) return;

    const latest = new Date(
      performanceRaw[performanceRaw.length - 1].date,
    );
    const end = new Date(latest);
    let start = new Date(latest);

    if (datePreset === "7d") {
      start.setDate(end.getDate() - 6);
    } else if (datePreset === "30d") {
      start.setDate(end.getDate() - 29);
    } else if (datePreset === "thisMonth") {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    }

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  }, [datePreset, performanceRaw]);

  // สร้าง series จาก performanceRaw ตาม range + ช่วงวันที่
  useEffect(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const inRange = (d: Date) =>
      (!start || d >= start) && (!end || d <= end);

    const filtered = performanceRaw.filter((item) => {
      const d = new Date(item.date);
      return inRange(d);
    });

    if (filtered.length === 0) {
      setSeries([]);
      return;
    }

    // แสดงทีละวัน (daily) ภายในช่วงวันที่ที่เลือก
    // เรียงตามวันที่ แล้วเลือกมาแสดงไม่เกิน 5 จุดแบบกระจายเท่ากันในช่วงวันที่
    const sorted = filtered.sort(
      (a, b) => +new Date(a.date) - +new Date(b.date),
    );

    let limited = sorted;
    const maxPoints = 31;
    if (sorted.length > maxPoints) {
      const step = (sorted.length - 1) / (maxPoints - 1);
      const picked: typeof sorted = [];
      for (let i = 0; i < maxPoints; i++) {
        const idx = Math.round(i * step);
        picked.push(sorted[idx]);
      }
      limited = picked;
    }

    const points: PerformancePoint[] = limited.map((item) => {
      const d = new Date(item.date);
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      return { label, value: item.value };
    });

    setSeries(points);
  }, [startDate, endDate, performanceRaw]);

  return (
    <ProtectedRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      userRole={state.user?.role || null}
      requiredRole="technician"
    >
      <TechnicianLayout>
        <div className="font-prompt min-h-screen bg-gray-50 px-4 py-6 md:px-8 rounded-2xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-1 text-[12px] font-medium text-blue-700">
                <LayoutDashboard className="h-4 w-4" />
                <span>{roleLabel}</span>
              </div>
              <h1 className="mt-3 text-[22px] font-bold text-gray-900 md:text-[24px]">
                ภาพรวมผลงานของคุณ
              </h1>
              <p className="text-[14px] text-gray-600">
                คุณ {name} สามารถติดตามประสิทธิภาพการทำงานของคุณได้จากหน้านี้
              </p>
            </div>

            <div className="mt-2 flex flex-col items-start gap-1 rounded-2xl bg-white px-4 py-3 text-[13px] text-gray-600 shadow-sm md:items-end">
              <span className="font-medium text-gray-800">
                งานทั้งหมดของคุณ
              </span>
              <div className="flex flex-wrap gap-3 text-[12px]">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                  สำเร็จ {stats.total_completed} งาน
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                  กำลังดำเนินการ {stats.total_in_progress} งาน
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                  รอรับงาน {stats.total_pending} งาน
                </span>
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <DashboardSummaryCards
            stats={stats}
            completionPercent={completionPercent}
          />

          {/* Performance sections */}
          <div className="grid gap-4 lg:grid-cols-3">
            <PerformanceChartSection
              series={currentSeries}
              datePreset={datePreset}
              setDatePreset={setDatePreset}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              thisMonthCompleted={stats.this_month_completed}
              lastMonthCompleted={stats.last_month_completed}
            />

            <WorkStatusAndTopTasks
              stats={stats}
              isLoading={isLoading}
              topTasks={topTasks}
            />
          </div>
        </div>
      </TechnicianLayout>
    </ProtectedRoute>
  );
};

export default TechnicianDashboardPage;

