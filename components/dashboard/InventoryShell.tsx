"use client";

import { memo } from "react";
import { INVENTORY_FILTERS, INVENTORY_ROWS } from "@/constants/dashboard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { useDashboardData } from "@/hooks/useDashboardData";
import { InventoryMetricsPanel } from "@/components/dashboard/InventoryMetricsPanel";
import { InventoryTable } from "@/components/dashboard/InventoryTable";
import styles from "@/styles/dashboard.module.css";

function InventoryShellComponent() {
  const { sidebarItems } = useDashboardData();

  return (
    <main className={styles.root}>
      <Sidebar items={sidebarItems} activeItemId="inventory" />
      <div className={styles.contentWrap}>
        <TopBar searchPlaceholder="Search inventory..." />
        <section className={styles.inventoryPageWrap}>
          <header className={styles.inventoryHeader}>
            <div>
              <h1>Asset Inventory</h1>
              <p>Manage and audit tactical equipment and hardware across Zone Alpha-7.</p>
            </div>
            <div className={styles.inventoryHeaderActions}>
              <button type="button" className={styles.inventoryGhostButton}>
                Export Report
              </button>
              <button type="button" className={styles.inventoryPrimaryButton}>
                Register Asset
              </button>
            </div>
          </header>

          <div className={styles.inventoryMetricsWrap}>
            <InventoryMetricsPanel />
          </div>

          <section className={styles.inventoryPanel}>
            <div className={styles.inventoryFilterBar}>
              <div className={styles.inventoryFilters}>
                {INVENTORY_FILTERS.map((filter, index) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`${styles.inventoryFilterChip} ${index === 0 ? styles.inventoryFilterChipActive : ""}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className={styles.inventoryToolbarButtons}>
                <button type="button" className={styles.inventoryMiniButton}>
                  ⌕
                </button>
                <button type="button" className={styles.inventoryMiniButton}>
                  ☰
                </button>
              </div>
            </div>
            <InventoryTable rows={INVENTORY_ROWS} />
          </section>
        </section>
      </div>
    </main>
  );
}

export const InventoryShell = memo(InventoryShellComponent);
