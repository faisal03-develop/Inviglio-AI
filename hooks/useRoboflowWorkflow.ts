"use client";

import { useCallback, useState } from "react";
import { runRoboflowWorkflow } from "@/lib/roboflow/client";
import type { RoboflowWorkflowResponse } from "@/lib/roboflow/types";
import { RoboflowClientError } from "@/lib/roboflow/types";
import type { RunWorkflowRequestBody } from "@/lib/roboflow/types";

export type UseRoboflowWorkflowState = {
  data: RoboflowWorkflowResponse | null;
  error: string | null;
  isLoading: boolean;
  run: (body: RunWorkflowRequestBody) => Promise<RoboflowWorkflowResponse | null>;
  reset: () => void;
};

export function useRoboflowWorkflow(): UseRoboflowWorkflowState {
  const [data, setData] = useState<RoboflowWorkflowResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  const run = useCallback(async (body: RunWorkflowRequestBody) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await runRoboflowWorkflow(body);
      setData(result);
      return result;
    } catch (err) {
      const message =
        err instanceof RoboflowClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Workflow failed.";
      setError(message);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, error, isLoading, run, reset };
}
