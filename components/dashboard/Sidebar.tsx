import type { SidebarItem } from "@/constants/dashboard";
import styles from "@/styles/dashboard.module.css";
import { getInitials } from "@/utils/dashboard";

type SidebarProps = {
  items: SidebarItem[];
};

export function Sidebar({ items }: SidebarProps) {
  const operatorName = "Alex Mercer";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandBlock}>
        <p className={styles.brandTitle}>SENTINEL</p>
        <p className={styles.brandSubTitle}>SECURITY CORE</p>
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

      <div className={styles.profileFooter}>
        <div className={styles.profileAvatar}>{getInitials(operatorName)}</div>
        <div>
          <p className={styles.profileName}>{operatorName}</p>
          <p className={styles.profileRole}>Chief Operator</p>
        </div>
      </div>
    </aside>
  );
}
