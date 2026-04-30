"use client";

import { UnderDevelopmentShell } from "@/components/dashboard/UnderDevelopmentShell";

export default function LogsPageView() {
  return (
    <UnderDevelopmentShell
      activeItemId="logs"
      title="Logs"
      description="The logs workspace is under development. Advanced filtering, export, and timeline playback will be available soon."
    />
  );
}
