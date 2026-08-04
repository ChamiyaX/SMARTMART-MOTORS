"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";

type ChartPoint = { name: string; count: number };

export function AnalyticsCharts({
  eventsByType,
  eventsByDay,
}: {
  eventsByType: ChartPoint[];
  eventsByDay: ChartPoint[];
}) {
  const typeData =
    eventsByType.length > 0
      ? eventsByType
      : [
          { name: "page_view", count: 0 },
          { name: "product_view", count: 0 },
          { name: "inquiry", count: 0 },
        ];

  const dayData =
    eventsByDay.length > 0
      ? eventsByDay
      : Array.from({ length: 7 }).map((_, i) => ({
          name: `Day ${i + 1}`,
          count: 0,
        }));

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Events by type
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="count" fill="#E10600" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Events over time
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dayData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#E10600"
                strokeWidth={2}
                dot={{ fill: "#E10600", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
