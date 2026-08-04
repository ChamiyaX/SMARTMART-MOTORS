import { format, subDays } from "date-fns";
import { MousePointerClick, Eye, MessageSquare } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { AnalyticsCharts } from "./analytics-charts";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  let totalEvents = 0;
  let pageViews = 0;
  let inquiries = 0;
  let eventsByType: Array<{ name: string; count: number }> = [];
  let eventsByDay: Array<{ name: string; count: number }> = [];
  let dbError: string | null = null;

  try {
    const since = subDays(new Date(), 13);

    const [all, views, msgs, grouped, recent] = await Promise.all([
      prisma.analyticsEvent.count(),
      prisma.analyticsEvent.count({ where: { event: "page_view" } }),
      prisma.analyticsEvent.count({ where: { event: "inquiry" } }),
      prisma.analyticsEvent.groupBy({
        by: ["event"],
        _count: { event: true },
        orderBy: { _count: { event: "desc" } },
        take: 8,
      }),
      prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
    ]);

    totalEvents = all;
    pageViews = views;
    inquiries = msgs;
    eventsByType = grouped.map((g) => ({
      name: g.event,
      count: g._count.event,
    }));

    const dayMap = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      dayMap.set(format(subDays(new Date(), i), "MMM d"), 0);
    }
    for (const event of recent) {
      const key = format(event.createdAt, "MMM d");
      dayMap.set(key, (dayMap.get(key) || 0) + 1);
    }
    eventsByDay = Array.from(dayMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Traffic and engagement signals from tracked events."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard title="Total events" value={totalEvents} icon={MousePointerClick} />
        <StatCard title="Page views" value={pageViews} icon={Eye} />
        <StatCard title="Inquiries" value={inquiries} icon={MessageSquare} />
      </div>
      <AnalyticsCharts eventsByType={eventsByType} eventsByDay={eventsByDay} />
    </div>
  );
}
