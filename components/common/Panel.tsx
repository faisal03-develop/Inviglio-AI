import type { ReactNode } from "react";
import styles from "@/styles/dashboard.module.css";

type PanelProps = {
  title: ReactNode;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export function Panel({ title, rightSlot, children }: PanelProps) {
  return (
    <section className={styles.panel}>
      <header className={styles.panelHeader}>
        <h3>{title}</h3>
        {rightSlot}
      </header>
      {children}
    </section>
  );
}
