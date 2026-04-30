"use client";

import { memo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { useDashboardData } from "@/hooks/useDashboardData";
import styles from "@/styles/dashboard.module.css";

type UnderDevelopmentShellProps = {
  activeItemId: "logs" | "settings";
  title: string;
  description: string;
};

function UnderDevelopmentShellComponent({
  activeItemId,
  title,
  description,
}: UnderDevelopmentShellProps) {
  const { sidebarItems } = useDashboardData();

  return (
    <main className={styles.root}>
      <Sidebar items={sidebarItems} activeItemId={activeItemId} />
      <div className={styles.contentWrap}>
        <TopBar searchPlaceholder={`Search ${title.toLowerCase()}...`} />
        <section className={styles.underDevWrap}>
          <div className={styles.underDevCard}>
            <p className={styles.underDevEyebrow}>Coming soon</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export const UnderDevelopmentShell = memo(UnderDevelopmentShellComponent);
