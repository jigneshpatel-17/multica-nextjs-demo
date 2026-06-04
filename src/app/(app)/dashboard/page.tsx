"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { WeeklyTrendChart } from "@/components/dashboard/WeeklyTrendChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { getDashboard } from "@/services/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api";
import type { DashboardResponse } from "@/types/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctl = new AbortController();
    setLoading(true);
    setError(null);
    getDashboard(ctl.signal)
      .then((d) => setData(d))
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof ApiError ? e.message : "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
    return () => ctl.abort();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {user ? `Welcome back, ${user.name.split(" ")[0]}` : "Dashboard"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Snapshot of your tasks and recent activity.
          </p>
        </div>
        <Link href="/tasks/new">
          <Button>New task</Button>
        </Link>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : data ? (
        <>
          <section
            aria-label="Task statistics"
            className="grid gap-3 grid-cols-2 lg:grid-cols-4"
          >
            <StatsCard label="Total" value={data.stats.total} />
            <StatsCard label="Pending" value={data.stats.pending} tone="warning" />
            <StatsCard label="Completed" value={data.stats.completed} tone="success" />
            <StatsCard label="Overdue" value={data.stats.overdue} tone="danger" />
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly completion trend</CardTitle>
              </CardHeader>
              <CardBody>
                <WeeklyTrendChart data={data.completionTrend} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
                <Link
                  href="/tasks"
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  View all
                </Link>
              </CardHeader>
              <CardBody>
                <RecentActivity tasks={data.recentActivity} />
              </CardBody>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
