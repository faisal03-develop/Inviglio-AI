"use client";

import { memo, useMemo } from "react";
import { useWorkflowMetrics } from "@/contexts/WorkflowMetricsContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { CameraStrip } from "@/components/dashboard/CameraStrip";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import { RecentAnomalies } from "@/components/dashboard/RecentAnomalies";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import type { MetricStat } from "@/constants/dashboard";
import styles from "@/styles/dashboard.module.css";

function DashboardShellComponent() {
  const { anomalies, cameraThumbs, metricStats, sidebarItems } = useDashboardData();
  const { snapshot } = useWorkflowMetrics();

  const metricsWithWorkflowCount = useMemo<MetricStat[]>(
    () =>
      metricStats.map((stat) => {
        if (stat.label !== "Processing" || !snapshot) {
          return stat;
        }
        const value =
          snapshot.count !== null && snapshot.count !== undefined
            ? snapshot.count
            : snapshot.predictionsCount;
        return { ...stat, value: String(value) };
      }),
    [metricStats, snapshot],
  );

  return (
    <main className={styles.root}>
      <Sidebar items={sidebarItems} activeItemId="dashboard" />
      <div className={styles.contentWrap}>
        <TopBar searchPlaceholder="Search cameras, zones, alerts..." />
        <section className={styles.mainGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.liveHeader}>
              <h1>Live Dashboard</h1>
              <p>Real-time monitoring and analytics for Zone Alpha-7</p>
            </div>
            <LiveFeed />
            <CameraStrip cameras={cameraThumbs} />
          </div>
          <aside className={styles.rightColumn}>
            <p className={styles.onlineStatus}>SYSTEM ONLINE</p>
            <MetricsPanel stats={metricsWithWorkflowCount} />
            <RecentAnomalies anomalies={anomalies} />
          </aside>
        </section>
      </div>
    </main>
  );
}

export const DashboardShell = memo(DashboardShellComponent);
