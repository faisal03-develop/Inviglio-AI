import { UserButton } from "@clerk/nextjs";
import styles from "@/styles/dashboard.module.css";

export function TopBar() {
  return (
    <header className={styles.topBar}>
      <p className={styles.topBarTitle}>SENTINEL COMMAND</p>
      <div className={styles.searchWrap}>
        <input
          aria-label="Search feeds"
          placeholder="Search cameras, zones, alerts..."
          className={styles.searchInput}
        />
      </div>
      <div className={styles.topBarActions}>
        <button type="button" className={styles.iconButton}>
          ⏺
        </button>
        <button type="button" className={styles.iconButton}>
          ⚙
        </button>
        <button type="button" className={styles.iconButton}>
          ?
        </button>
        <button type="button" className={styles.stopButton}>
          Emergency Stop
        </button>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}
