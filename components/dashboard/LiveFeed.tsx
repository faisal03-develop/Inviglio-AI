import styles from "@/styles/dashboard.module.css";

export function LiveFeed() {
  return (
    <section className={styles.liveFeed}>
      <div className={styles.feedHeader}>
        <span className={styles.feedTag}>REC</span>
        <strong>Warehouse A - Main Floor</strong>
        <span className={styles.feedAiTag}>AI TRACKING ACTIVE</span>
      </div>

      <div className={styles.overlayBoxGreen}>
        <p>ID: P-402</p>
        <p>(Authorized)</p>
      </div>

      <div className={styles.overlayBoxAmber}>
        <p>Zone: Forklift Y-2</p>
      </div>
    </section>
  );
}
