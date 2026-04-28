"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

// Page-level dashboard composition so route files stay lightweight.
export default function DashboardPageView() {
  return <DashboardShell />;
}
