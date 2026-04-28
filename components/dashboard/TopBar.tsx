import { UserButton } from "@clerk/nextjs";
import styles from "@/styles/dashboard.module.css";

type TopBarProps = {
  searchPlaceholder?: string;
};

export function TopBar({ searchPlaceholder = "Search cameras, zones, alerts..." }: TopBarProps) {
  return (
    <header className={styles.topBar}>
      <p className={styles.topBarTitle}>SENTINEL COMMAND</p>
      <div className={styles.searchWrap}>
        <input
          aria-label="Search feeds"
          placeholder={searchPlaceholder}
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
