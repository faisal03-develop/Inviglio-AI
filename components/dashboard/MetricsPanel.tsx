import type { MetricStat } from "@/constants/dashboard";
import { Panel } from "@/components/common/Panel";
import { StatusPill } from "@/components/common/StatusPill";
import styles from "@/styles/dashboard.module.css";

type MetricsPanelProps = {
  stats: MetricStat[];
};

export function MetricsPanel({ stats }: MetricsPanelProps) {
  return (
    <Panel title="Inventory Metrics">
      <div className={styles.metricsGrid}>
        {stats.map((stat) => (
          <article key={stat.label} className={styles.metricCard}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <article className={styles.discrepancyCard}>
        <div>
          <p>Discrepancies</p>
          <strong>12</strong>
        </div>
        <StatusPill text="2 from last shift" tone="danger" />
      </article>
    </Panel>
  );
}
