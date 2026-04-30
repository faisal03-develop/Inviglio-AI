"use client";

import { UnderDevelopmentShell } from "@/components/dashboard/UnderDevelopmentShell";

export default function SettingsPageView() {
  return (
    <UnderDevelopmentShell
      activeItemId="settings"
      title="Settings"
      description="The settings workspace is under development. Role controls, environment preferences, and integration options are coming soon."
    />
  );
}
