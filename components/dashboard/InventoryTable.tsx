import type { InventoryRow } from "@/constants/dashboard";
import styles from "@/styles/dashboard.module.css";

type InventoryTableProps = {
  rows: InventoryRow[];
};

function statusClass(status: InventoryRow["status"]) {
  if (status === "Match") return styles.inventoryStatusMatch;
  if (status === "Discrepancy") return styles.inventoryStatusDiscrepancy;
  return styles.inventoryStatusLow;
}

export function InventoryTable({ rows }: InventoryTableProps) {
  return (
    <div className={styles.inventoryTableWrap}>
      <table className={styles.inventoryTable}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Item Description</th>
            <th>Expected</th>
            <th>Current</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.sku}
              className={row.status === "Discrepancy" ? styles.inventoryRowAlert : ""}
            >
              <td>{row.sku}</td>
              <td>
                <p className={styles.inventoryItemTitle}>{row.itemName}</p>
                <p className={styles.inventoryItemSub}>{row.location}</p>
              </td>
              <td>{row.expected}</td>
              <td>{row.current}</td>
              <td>
                <span className={`${styles.inventoryStatus} ${statusClass(row.status)}`}>
                  {row.status.toUpperCase()}
                </span>
              </td>
              <td />
            </tr>
          ))}
        </tbody>
      </table>
      <footer className={styles.inventoryTableFooter}>
        <span>Showing 1-4 of 1,204 items</span>
        <div className={styles.inventoryPager}>
          <button type="button">{"<"}</button>
          <button type="button">{">"}</button>
        </div>
      </footer>
    </div>
  );
}
