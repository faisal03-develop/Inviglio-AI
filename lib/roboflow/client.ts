import type {
  RoboflowWorkflowResponse,
  RunWorkflowRequestBody,
} from "@/lib/roboflow/types";
import { RoboflowClientError } from "@/lib/roboflow/types";

async function safeJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

function isErrorEnvelope(value: unknown): value is { error: string; code?: string } {
  if (value === null || typeof value !== "object") {
    return false;
  }
  return (
    "error" in value && typeof (value as { error: unknown }).error === "string"
  );
}

async function postWorkflowAndParse(
  init: RequestInit,
): Promise<RoboflowWorkflowResponse> {
  let response: Response;
  try {
    response = await fetch("/api/roboflow/workflow", {
      ...init,
      credentials: "same-origin",
    });
  } catch {
    throw new RoboflowClientError(
      "Network error while contacting the workflow API.",
      "NETWORK_ERROR",
      0,
    );
  }

  const data = await safeJson(response);

  if (!response.ok) {
    if (response.status === 401) {
      throw new RoboflowClientError("Sign in required.", "UNAUTHORIZED", 401);
    }

    const message = isErrorEnvelope(data)
      ? data.error
      : `Workflow request failed (${response.status}).`;

    const code =
      isErrorEnvelope(data) && data.code === "CONFIG_ERROR"
        ? "CONFIG_ERROR"
        : response.status >= 500
          ? "UPSTREAM_ERROR"
          : "UNKNOWN_ERROR";

    throw new RoboflowClientError(message, code, response.status, data);
  }

  if (!data || typeof data !== "object") {
    throw new RoboflowClientError("Unexpected empty response.", "UNKNOWN_ERROR", response.status);
  }

  return data as RoboflowWorkflowResponse;
}

/**
 * Runs the workflow via the Next.js API route (credentials included for Clerk session).
 */
export async function runRoboflowWorkflow(
  body: RunWorkflowRequestBody,
): Promise<RoboflowWorkflowResponse> {
  return postWorkflowAndParse({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * Uploads an image file as multipart/form-data; the server converts to base64 and calls Roboflow.
 */
export async function runRoboflowWorkflowUpload(file: File): Promise<RoboflowWorkflowResponse> {
  const formData = new FormData();
  formData.append("image", file);
  return postWorkflowAndParse({
    method: "POST",
    body: formData,
  });
}
