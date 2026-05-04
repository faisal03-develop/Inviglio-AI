import { DEFAULT_WORKFLOW_URL } from "@/lib/roboflow/constants";
import { fetchWithRetry } from "@/lib/roboflow/retry";
import type { RunWorkflowRequestBody } from "@/lib/roboflow/types";

function getWorkflowUrl(): string {
  const url = process.env.ROBOFLOW_WORKFLOW_URL?.trim();
  return url && url.length > 0 ? url : DEFAULT_WORKFLOW_URL;
}

function getApiKey(): string {
  const key = process.env.ROBOFLOW_API_KEY?.trim();
  if (!key) {
    throw new Error("ROBOFLOW_API_KEY is not configured.");
  }
  return key;
}

/**
 * Server-only call to Roboflow Serverless Workflow. Keeps the API key off the client.
 */
export async function callRoboflowWorkflow(
  body: RunWorkflowRequestBody,
): Promise<Response> {
  const apiKey = getApiKey();
  const workflowUrl = getWorkflowUrl();

  return fetchWithRetry(
    workflowUrl,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        inputs: {
          image: body.image,
        },
      }),
    },
    fetch,
  );
}
