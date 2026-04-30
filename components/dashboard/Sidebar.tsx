import Link from "next/link";
import Image from "next/image";
import type { SidebarItem } from "@/constants/dashboard";
import styles from "@/styles/dashboard.module.css";
import { getInitials } from "@/utils/dashboard";

type SidebarProps = {
  items: SidebarItem[];
  activeItemId?: string;
};

export function Sidebar({ items, activeItemId = "dashboard" }: SidebarProps) {
  const operatorName = "Alex Mercer";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandBlock}>
        <div className={styles.brandIdentity}>
          <Image
            src="/logo/inviglio2.png"
            alt="Inviglio AI logo"
            width={200}
            height={50}
            className={styles.brandLogo}
            priority
          />
          {/* <p className={styles.brandTitle}>Inviglio AI</p> */}
        </div>
        {/* <p className={styles.brandSubTitle}>Intelligent Inventory Command</p> */}
      </div>

      <nav className={styles.navList} aria-label="Primary">
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <Link
              key={item.id}
              href={item.href ?? "/dashboard"}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
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
