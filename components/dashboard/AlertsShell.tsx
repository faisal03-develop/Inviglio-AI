"use client";

import { memo } from "react";
import { ALERT_ITEMS } from "@/constants/dashboard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { useDashboardData } from "@/hooks/useDashboardData";
import styles from "@/styles/dashboard.module.css";

function severityStyles(severity: string) {
  if (severity === "Critical") {
    return {
      card: styles.alertCardCritical,
      badge: styles.alertBadgeCritical,
      icon: "⛨",
    };
  }
  if (severity === "Warning") {
    return {
      card: styles.alertCardWarning,
      badge: styles.alertBadgeWarning,
      icon: "◉",
    };
  }
  return {
    card: styles.alertCardNotice,
    badge: styles.alertBadgeNotice,
    icon: "i",
  };
}

function AlertsShellComponent() {
  const { sidebarItems } = useDashboardData();

  return (
    <main className={styles.root}>
      <Sidebar items={sidebarItems} activeItemId="alerts" />
      <div className={styles.contentWrap}>
        <TopBar searchPlaceholder="Search logs..." />
        <section className={styles.alertsPageWrap}>
          <header className={styles.alertsHeader}>
            <div>
              <h1>Active Alerts</h1>
              <p>Monitoring Zone Alpha-7 across 42 endpoints</p>
            </div>
            <button type="button" className={styles.alertsClearButton}>
              Clear All
            </button>
          </header>

          <div className={styles.alertsList}>
            {ALERT_ITEMS.map((alert) => {
              const severity = severityStyles(alert.severity);
              return (
                <article key={alert.id} className={`${styles.alertCard} ${severity.card}`}>
                  <div className={styles.alertIcon}>{severity.icon}</div>
                  <div className={styles.alertMain}>
                    <div className={styles.alertMainTop}>
                      <div className={styles.alertTitleWrap}>
                        <span className={`${styles.alertBadge} ${severity.badge}`}>
                          {alert.severity}
                        </span>
                        <h3>{alert.title}</h3>
                      </div>
                      <span className={styles.alertTime}>{alert.timeUtc}</span>
                    </div>

                    <div className={styles.alertDetails}>
                      <div>
                        <p className={styles.alertDetailLabel}>{alert.leftLabel}</p>
                        <p className={styles.alertDetailValue}>{alert.leftValue}</p>
                      </div>
                      <div>
                        <p className={styles.alertDetailLabel}>{alert.rightLabel}</p>
                        <p className={styles.alertDetailValue}>{alert.rightValue}</p>
                      </div>
                    </div>

                    {alert.actions.length > 0 ? (
                      <div className={styles.alertActions}>
                        {alert.actions.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            className={
                              action.kind === "primary"
                                ? styles.alertActionPrimary
                                : styles.alertActionSecondary
                            }
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export const AlertsShell = memo(AlertsShellComponent);
