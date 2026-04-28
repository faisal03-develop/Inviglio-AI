import type { AnomalyItem } from "@/constants/dashboard";
import { Panel } from "@/components/common/Panel";
import styles from "@/styles/dashboard.module.css";

type RecentAnomaliesProps = {
  anomalies: AnomalyItem[];
};

export function RecentAnomalies({ anomalies }: RecentAnomaliesProps) {
  return (
    <Panel title="Recent Anomalies" rightSlot={<button className={styles.viewAll}>View All</button>}>
      <ul className={styles.anomalyList}>
        {anomalies.map((item) => (
          <li key={item.id} className={styles.anomalyItem}>
            <div className={styles.anomalyIcon}>◫</div>
            <div>
              <p className={styles.anomalyTitle}>{item.title}</p>
              <div className={styles.anomalyMeta}>
                <span>{item.location}</span>
                <span>{item.time}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
