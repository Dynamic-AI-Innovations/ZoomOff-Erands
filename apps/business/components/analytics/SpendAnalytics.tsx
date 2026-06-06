"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@zoomoff/api-client";
import { Card, Button, Badge, Skeleton } from "@zoomoff/ui";
import { BarChart3, TrendingUp, DollarSign, Package } from "lucide-react";

type DateRange = "7d" | "30d" | "90d";

function formatNaira(n: number) { return `₦${n.toLocaleString("en-NG")}`; }

export function SpendAnalytics() {
  const [range, setRange] = React.useState<DateRange>("30d");

  const { data, isLoading } = useQuery({
    queryKey: ["business-spend", range],
    queryFn: () => apiClient.get<{ data: {
      totalGmv: number;
      avgTaskCost: number;
      totalTasks: number;
      byDepartment: { name: string; spend: number; tasks: number }[];
      byCategory: { category: string; spend: number }[];
      momChange: number;
    }}>(`/business/analytics/spend?range=${range}`).then(r => r.data.data),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Spend Analytics</h1>
          <p className="text-sm text-zo-muted mt-1">Organisation-wide task spend insights</p>
        </div>
        <div className="flex gap-2">
          {(["7d","30d","90d"] as DateRange[]).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${range === r ? "border-brand-gold bg-brand-gold/10 text-brand-charcoal" : "border-zo-border text-zo-muted"}`}>
              {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map(i=><Skeleton key={i} height={80} className="rounded-2xl" />)}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Spend", value: formatNaira(data?.totalGmv ?? 0), icon: DollarSign },
              { label: "Tasks Completed", value: data?.totalTasks ?? 0, icon: Package },
              { label: "Avg Task Cost", value: formatNaira(data?.avgTaskCost ?? 0), icon: BarChart3 },
              { label: "vs Last Period", value: `${(data?.momChange ?? 0) >= 0 ? "+" : ""}${data?.momChange ?? 0}%`, icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} padding="sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-zo-muted">{label}</p>
                    <p className="font-display text-lg font-bold text-brand-charcoal mt-0.5">{value}</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/10">
                    <Icon className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Department breakdown */}
          {(data?.byDepartment?.length ?? 0) > 0 && (
            <Card>
              <h2 className="font-semibold text-brand-charcoal mb-4">Spend by Department</h2>
              <div className="space-y-3">
                {data!.byDepartment.map(dept => {
                  const pct = Math.round((dept.spend / (data!.totalGmv || 1)) * 100);
                  return (
                    <div key={dept.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-brand-charcoal">{dept.name}</span>
                        <span className="text-zo-muted">{formatNaira(dept.spend)} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-zo-border overflow-hidden">
                        <div className="h-full rounded-full bg-brand-gold" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Export */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm">Export PDF Report</Button>
            <Button variant="outline" size="sm">Export Excel/CSV</Button>
          </div>
        </>
      )}

      {/* Empty state */}
      {!isLoading && !data?.totalTasks && (
        <Card className="text-center py-12">
          <BarChart3 className="h-10 w-10 text-zo-border mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm font-semibold text-brand-charcoal">No spend data yet</p>
          <p className="text-xs text-zo-muted mt-1">Post tasks to see analytics here</p>
        </Card>
      )}
    </div>
  );
}
