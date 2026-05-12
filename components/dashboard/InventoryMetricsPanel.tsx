"use client";

import { useMemo } from "react";
import { Panel } from "@/components/common/Panel";
import { useWorkflowMetrics } from "@/contexts/WorkflowMetricsContext";
import styles from "@/styles/dashboard.module.css";

function formatAnalyzedAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function InventoryMetricsPanel() {
  const { snapshot } = useWorkflowMetrics();

  const primaryCountLabel = useMemo(() => {
    if (!snapshot) {
      return "—";
    }
    if (snapshot.count !== null && snapshot.count !== undefined) {
      return String(snapshot.count);
    }
    if (snapshot.predictionsCount > 0) {
      return String(snapshot.predictionsCount);
    }
    return "0";
  }, [snapshot]);

  const subtitle = snapshot
    ? `Last image analysis: ${formatAnalyzedAt(snapshot.analyzedAtIso)}`
    : "Run an analysis from the Dashboard live feed or Product Detector to populate metrics.";

  return (
    <Panel title="Inventory Metrics">
      <p className={styles.inventoryMetricsSubtitle}>{subtitle}</p>
      <div className={styles.inventoryMetricsGrid}>
        <article className={styles.metricCard}>
          <p>Objects detected (last scan)</p>
          <strong>{snapshot ? primaryCountLabel : "—"}</strong>
        </article>
        <article className={styles.metricCard}>
          <p>Predictions (last scan)</p>
          <strong>{snapshot ? String(snapshot.predictionsCount) : "—"}</strong>
        </article>
        <article className={styles.metricCard}>
          <p>Analysis status</p>
          <strong>{snapshot ? "Latest run synced" : "No scan data yet"}</strong>
        </article>
      </div>
    </Panel>
  );
}
