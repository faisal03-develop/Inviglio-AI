import { SignOutButton } from "@clerk/nextjs";
import type { SidebarItem } from "@/constants/dashboard";
import styles from "@/styles/dashboard.module.css";

type SidebarProps = {
  items: SidebarItem[];
};

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandBlock}>
        <div className={styles.shield}>◍</div>
        <div>
          <p className={styles.brandTitle}>Inviglio AI</p>
          <p className={styles.brandSubTitle}>Zone Alpha-7</p>
        </div>
      </div>

      <nav className={styles.navList} aria-label="Primary">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${item.active ? styles.navItemActive : ""}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.sidebarActions}>
        <button type="button" className={styles.incidentButton}>
          + New Incident Report
        </button>
        <button type="button" className={styles.secondaryAction}>
          Support
        </button>
        <SignOutButton><button type="button" className={styles.secondaryAction}>Logout</button></SignOutButton>
      </div>
    </aside>
  );
}
