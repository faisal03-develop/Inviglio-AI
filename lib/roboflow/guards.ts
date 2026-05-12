import type { WorkflowProxySuccess } from "@/lib/roboflow/types";

export function isWorkflowProxySuccess(value: unknown): value is WorkflowProxySuccess {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as WorkflowProxySuccess).success === true
  );
}
