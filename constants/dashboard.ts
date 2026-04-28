export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  href?: string;
};

export type MetricStat = {
  label: string;
  value: string;
};

export type CameraThumb = {
  id: string;
  label: string;
  muted?: boolean;
};

export type AnomalyItem = {
  id: string;
  title: string;
  location: string;
  time: string;
};

export type InventoryFilter = {
  id: string;
  label: string;
};

export type InventoryRow = {
  sku: string;
  itemName: string;
  location: string;
  expected: number;
  current: number;
  status: "Match" | "Discrepancy" | "Low Stock";
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦", active: true, href: "/dashboard" },
  { id: "inventory", label: "Inventory", icon: "◉", href: "/inventory" },
  { id: "alerts", label: "Alerts", icon: "△", href: "/dashboard" },
  { id: "logs", label: "Logs", icon: "▤", href: "/dashboard" },
  { id: "settings", label: "Settings", icon: "⚙", href: "/dashboard" },
];

export const METRIC_STATS: MetricStat[] = [
  { label: "Total Scanned", value: "14,208" },
  { label: "Processing", value: "342" },
];

export const CAMERA_THUMBS: CameraThumb[] = [
  { id: "dock", label: "Dock Ext North" },
  { id: "sector", label: "Sector 7G - Corridors" },
  { id: "perimeter", label: "Perimeter Fence W", muted: true },
];

export const RECENT_ANOMALIES: AnomalyItem[] = [
  {
    id: "1",
    title: "Unauthorized Personnel",
    location: "Sector 7G",
    time: "10:42 AM",
  },
  {
    id: "2",
    title: "Conveyor Stoppage",
    location: "Line B",
    time: "10:15 AM",
  },
  {
    id: "3",
    title: "Unrecognized Pallet Tag",
    location: "Dock Ext",
    time: "09:30 AM",
  },
];

export const INVENTORY_FILTERS: InventoryFilter[] = [
  { id: "all", label: "All Items (1,204)" },
  { id: "in-stock", label: "In Stock" },
  { id: "low-stock", label: "Low Stock (12)" },
  { id: "discrepancy", label: "Discrepancy (3)" },
];

export const INVENTORY_ROWS: InventoryRow[] = [
  {
    sku: "TAC-V-092",
    itemName: "Tactical Vest, Level III",
    location: "Armory B, Rack 4",
    expected: 45,
    current: 45,
    status: "Match",
  },
  {
    sku: "UHF-R-114",
    itemName: "UHF Handheld Radio",
    location: "Comms Locker 2",
    expected: 120,
    current: 118,
    status: "Discrepancy",
  },
  {
    sku: "NVG-G3-05",
    itemName: "Night Vision Goggles Gen3",
    location: "Secure Vault Alpha",
    expected: 15,
    current: 15,
    status: "Low Stock",
  },
  {
    sku: "MED-K-X1",
    itemName: "Trauma Kit, Advanced",
    location: "Medical Bay Supply",
    expected: 250,
    current: 250,
    status: "Match",
  },
];
