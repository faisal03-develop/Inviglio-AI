"use client";

import { useMemo } from "react";
import {
  CAMERA_THUMBS,
  METRIC_STATS,
  RECENT_ANOMALIES,
  SIDEBAR_ITEMS,
} from "@/constants/dashboard";

export function useDashboardData() {
  return useMemo(
    () => ({
      sidebarItems: SIDEBAR_ITEMS,
      metricStats: METRIC_STATS,
      cameraThumbs: CAMERA_THUMBS,
      anomalies: RECENT_ANOMALIES,
    }),
    [],
  );
}
