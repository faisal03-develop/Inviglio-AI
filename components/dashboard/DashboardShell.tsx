"use client";

import { memo } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { CameraStrip } from "@/components/dashboard/CameraStrip";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import { RecentAnomalies } from "@/components/dashboard/RecentAnomalies";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import styles from "@/styles/dashboard.module.css";

function DashboardShellComponent() {
  const { anomalies, cameraThumbs, metricStats, sidebarItems } = useDashboardData();

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
            <MetricsPanel stats={metricStats} />
            <RecentAnomalies anomalies={anomalies} />
          </aside>
        </section>
      </div>
    </main>
  );
}

export const DashboardShell = memo(DashboardShellComponent);
