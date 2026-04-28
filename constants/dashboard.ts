export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
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

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "live", label: "Live Dashboard", icon: "◼", active: true },
  { id: "inventory", label: "Inventory", icon: "▣" },
  { id: "alert", label: "Alert Center", icon: "▲" },
  { id: "deep-dive", label: "Event Deep-Dive", icon: "↺" },
  { id: "analytics", label: "Analytics", icon: "▤" },
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
