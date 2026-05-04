import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { callRoboflowWorkflow } from "@/lib/roboflow/server";
import { parseWorkflowBody } from "@/lib/roboflow/validation";

export const runtime = "nodejs";

/**
 * Proxies workflow runs to Roboflow so ROBOFLOW_API_KEY stays server-side.
 * Expects POST JSON: { "image": { "type": "url"|"base64", "value": string } }
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  try {
    const body = parseWorkflowBody(json);
    try {
      const upstream = await callRoboflowWorkflow(body);
      const text = await upstream.text();

      let payload: unknown = text;
      try {
        payload = text.length ? JSON.parse(text) : null;
      } catch {
        payload = { raw: text };
      }

      return NextResponse.json(payload, { status: upstream.status });
    } catch {
      return NextResponse.json(
        { error: "Roboflow workflow request failed.", code: "UPSTREAM_ERROR" },
        { status: 502 },
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Workflow request failed.";

    if (message.includes("ROBOFLOW_API_KEY")) {
      return NextResponse.json(
        { error: "Roboflow is not configured on the server.", code: "CONFIG_ERROR" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: message, code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }
}
