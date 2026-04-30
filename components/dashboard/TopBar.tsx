import { UserButton } from "@clerk/nextjs";
// import Image from "next/image";
import styles from "@/styles/dashboard.module.css";

type TopBarProps = {
  searchPlaceholder?: string;
};

export function TopBar({ searchPlaceholder = "Search cameras, zones, alerts..." }: TopBarProps) {
  return (
    <header className={styles.topBar}>
      <div className={styles.topBrand}>
        {/* <Image
          src="/logo/inviglio2.png"
          alt="Inviglio AI logo"
          width={22}
          height={22}
          className={styles.topBrandLogo}
        /> */}
        <p className={styles.topBarTitle}>Inviglio AI</p>
      </div>
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
        <UserButton />
      </div>
    </header>
  );
}
