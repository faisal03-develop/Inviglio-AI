"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WorkflowProxySuccess } from "@/lib/roboflow/types";

const STORAGE_KEY = "inviglio-workflow-metrics-v1";

export type WorkflowMetricsSnapshot = {
  count: number | null;
  predictionsCount: number;
  analyzedAtIso: string;
};

type WorkflowMetricsContextValue = {
  snapshot: WorkflowMetricsSnapshot | null;
  recordAnalysis: (result: WorkflowProxySuccess) => void;
  clear: () => void;
};

const WorkflowMetricsContext = createContext<WorkflowMetricsContextValue | null>(null);

function readStored(): WorkflowMetricsSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as WorkflowMetricsSnapshot;
    if (typeof parsed.analyzedAtIso !== "string") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function WorkflowMetricsProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<WorkflowMetricsSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(readStored());
  }, []);

  const recordAnalysis = useCallback((result: WorkflowProxySuccess) => {
    const next: WorkflowMetricsSnapshot = {
      count: result.count,
      predictionsCount: Array.isArray(result.predictions) ? result.predictions.length : 0,
      analyzedAtIso: new Date().toISOString(),
    };
    setSnapshot(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota / private mode */
    }
  }, []);

  const clear = useCallback(() => {
    setSnapshot(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<WorkflowMetricsContextValue>(
    () => ({ snapshot, recordAnalysis, clear }),
    [snapshot, recordAnalysis, clear],
  );

  return (
    <WorkflowMetricsContext.Provider value={value}>{children}</WorkflowMetricsContext.Provider>
  );
}

export function useWorkflowMetrics(): WorkflowMetricsContextValue {
  const ctx = useContext(WorkflowMetricsContext);
  if (!ctx) {
    throw new Error("useWorkflowMetrics must be used within WorkflowMetricsProvider");
  }
  return ctx;
}
