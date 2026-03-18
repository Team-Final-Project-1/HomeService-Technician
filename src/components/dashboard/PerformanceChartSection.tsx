import { FC } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type PerformancePoint = {
  label: string;
  value: number;
};

type DatePreset = "7d" | "30d" | "thisMonth" | "custom";

type Props = {
  series: PerformancePoint[];
  datePreset: DatePreset;
  setDatePreset: (preset: DatePreset) => void;
  startDate: string | null;
  setStartDate: (value: string | null) => void;
  endDate: string | null;
  setEndDate: (value: string | null) => void;
  thisMonthCompleted: number;
  lastMonthCompleted: number;
};

export const PerformanceChartSection: FC<Props> = ({
  series,
  datePreset,
  setDatePreset,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  thisMonthCompleted,
  lastMonthCompleted,
}) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-900">
            ภาพรวมผลงานรายเดือน
          </h2>
          <p className="text-[13px] text-gray-500">
            เปรียบเทียบจำนวนงานสำเร็จระหว่างเดือนนี้กับเดือนที่แล้ว
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Date range preset + custom picker */}
          <div className="flex flex-col items-end gap-1 text-[11px] text-gray-600">
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
              {([
                { id: "7d", label: "7 วันล่าสุด" },
                { id: "30d", label: "30 วันล่าสุด" },
                { id: "thisMonth", label: "เดือนนี้" },
                { id: "custom", label: "กำหนดเอง" },
              ] as { id: DatePreset; label: string }[]).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDatePreset(p.id)}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    datePreset === p.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="mr-1 hidden md:inline">ช่วงวันที่:</span>
              <input
                type="date"
                value={startDate ?? ""}
                onChange={(e) => {
                  setDatePreset("custom");
                  setStartDate(e.target.value || null);
                }}
                className="h-7 rounded-md border border-gray-200 bg-white px-2 text-[11px] outline-none focus:border-blue-400"
              />
              <span className="px-1 text-gray-400">-</span>
              <input
                type="date"
                value={endDate ?? ""}
                onChange={(e) => {
                  setDatePreset("custom");
                  setEndDate(e.target.value || null);
                }}
                className="h-7 rounded-md border border-gray-200 bg-white px-2 text-[11px] outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-[13px] font-medium text-blue-800">เดือนนี้</p>
          <p className="mt-2 text-[26px] font-bold text-blue-900">
            {thisMonthCompleted} งาน
          </p>
          <p className="mt-1 text-[12px] text-blue-800">
            จำนวนงานที่คุณทำสำเร็จในเดือนปัจจุบัน
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-[13px] font-medium text-gray-700">เดือนที่แล้ว</p>
          <p className="mt-2 text-[26px] font-bold text-gray-900">
            {lastMonthCompleted} งาน
          </p>
          <p className="mt-1 text-[12px] text-gray-500">
            ใช้สำหรับเปรียบเทียบแนวโน้มการทำงานของคุณ
          </p>
        </div>
      </div>

      {/* Performance line chart with trend (daily) */}
      <div className="mt-6 rounded-2xl bg-gray-50 p-5">
        <p className="mb-3 text-[13px] font-medium text-gray-700">
          กราฟแนวโน้มผลงาน (รายวัน)
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={series}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient
                  id="performanceArea"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#60a5fa"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="#ffffff"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              <Tooltip
                cursor={{ stroke: "#bfdbfe", strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null;
                  }

                  const point = payload[0];

                  return (
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] text-gray-700 shadow-sm">
                      <div className="mb-1 text-gray-500">{label}</div>
                      <div className="font-semibold text-gray-900">
                        {point.value} งาน
                      </div>
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={undefined}
                fill="url(#performanceArea)"
                activeDot={false}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{
                  r: 4,
                  stroke: "#2563eb",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
                activeDot={{
                  r: 5,
                  stroke: "#2563eb",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

