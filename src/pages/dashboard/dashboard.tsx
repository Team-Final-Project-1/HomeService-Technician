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

type DatePreset = "7d" | "30d" | "thisMonth" | "custom";

const TechnicianDashboardPage = () => {
  const { state, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<TechnicianDashboardStats>(defaultStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [series, setSeries] = useState<PerformancePoint[]>([]);
  const [datePreset, setDatePreset] = useState<DatePreset>("30d");
  // Mock rank งานที่ช่างคนนี้ทำบ่อยที่สุด (ควรเปลี่ยนให้มาจาก backend ภายหลัง)
  const [topTasks] = useState<TechnicianTaskRank[]>([
    { id: "job1", jobName: "ล้างแอร์", count: 18 },
    { id: "job2", jobName: "ซ่อมไฟฟ้า", count: 14 },
    { id: "job3", jobName: "ติดตั้งปลั๊ก / สวิตช์", count: 11 },
    { id: "job4", jobName: "ตรวจเช็กระบบน้ำ", count: 7 },
    { id: "job5", jobName: "แก้ปัญหาท่อน้ำอุดตัน", count: 5 },
  ]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        // baseURL: "http://localhost:4000/api" → final URL: /technician-dashboard
        const res = await api.get("/technician-dashboard");
        setStats({
          ...defaultStats,
          ...(res.data || {}),
        });
      } catch (error) {
        console.error("Failed to fetch technician dashboard:", error);
        setStats(defaultStats);
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

  // Mock raw performance data (ต่อวัน) สำหรับเดโมการ filter วันที่
  const mockPerformanceRaw = [
    { date: "2026-03-01", value: 1 },
    { date: "2026-03-02", value: 2 },
    { date: "2026-03-03", value: 3 },
    { date: "2026-03-04", value: 1 },
    { date: "2026-03-05", value: 4 },
    { date: "2026-03-06", value: 3 },
    { date: "2026-03-07", value: 2 },
    { date: "2026-03-08", value: 1 },
    { date: "2026-03-09", value: 3 },
    { date: "2026-03-10", value: 2 },
    { date: "2026-03-11", value: 5 },
    { date: "2026-03-12", value: 4 },
    { date: "2026-03-13", value: 2 },
    { date: "2026-03-14", value: 3 },
    { date: "2026-03-15", value: 1 },
  ];

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const currentSeries = series;

  // ตั้งค่า start/end date ตาม preset (อิงจากวันที่ล่าสุดใน mockPerformanceRaw)
  useEffect(() => {
    if (datePreset === "custom" || mockPerformanceRaw.length === 0) return;

    const latest = new Date(
      mockPerformanceRaw[mockPerformanceRaw.length - 1].date,
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
  }, [datePreset]);

  // สร้าง series จาก mockPerformanceRaw ตาม range + ช่วงวันที่
  useEffect(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const inRange = (d: Date) =>
      (!start || d >= start) && (!end || d <= end);

    const filtered = mockPerformanceRaw.filter((item) => {
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
  }, [startDate, endDate]);

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

