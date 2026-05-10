import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { MAX_IMAGE_BYTES } from "@/lib/roboflow/constants";
import { normalizeWorkflowPayload } from "@/lib/roboflow/normalize";
import { callRoboflowWorkflow } from "@/lib/roboflow/server";
import { parseWorkflowBody } from "@/lib/roboflow/validation";

export const runtime = "nodejs";

function isMultipartRequest(request: Request): boolean {
  const type = request.headers.get("content-type") ?? "";
  return type.toLowerCase().includes("multipart/form-data");
}

async function respondWithNormalized(upstream: Response): Promise<NextResponse> {
  const text = await upstream.text();
  let parsed: unknown = text;
  try {
    parsed = text.length ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json(
      { error: "Roboflow returned non-JSON.", code: "UPSTREAM_ERROR" },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      typeof parsed === "object" && parsed !== null
        ? parsed
        : { error: `Roboflow returned ${upstream.status}`, raw: text },
      { status: upstream.status >= 400 ? upstream.status : 502 },
    );
  }

  const { count, predictions, annotatedImage } = normalizeWorkflowPayload(parsed);

  return NextResponse.json({
    success: true as const,
    count,
    predictions,
    annotatedImage,
  });
}

/**
 * Proxies workflow runs to Roboflow so ROBOFLOW_API_KEY stays server-side.
 *
 * - Multipart: field `image` (file) — image is converted to base64 server-side.
 * - JSON: `{ "image": { "type": "url"|"base64", "value": string } }`
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  if (isMultipartRequest(request)) {
    try {
      const formData = await request.formData();
      const file = formData.get("image");

      if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ error: "No image provided", code: "VALIDATION_ERROR" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: `Image too large (max ${MAX_IMAGE_BYTES} bytes).`, code: "VALIDATION_ERROR" },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString("base64");

      try {
        const upstream = await callRoboflowWorkflow({
          image: { type: "base64", value: base64Image },
        });
        return respondWithNormalized(upstream);
      } catch (nested) {
        const nestedMessage = nested instanceof Error ? nested.message : "";
        if (nestedMessage.includes("ROBOFLOW_API_KEY")) {
          return NextResponse.json(
            {
              error:
                "Roboflow is not configured. Set ROBOFLOW_API_KEY in your environment (e.g. .env.local) and restart the dev server.",
              code: "CONFIG_ERROR",
            },
            { status: 503 },
          );
        }
        return NextResponse.json(
          { error: "Roboflow workflow request failed.", code: "UPSTREAM_ERROR" },
          { status: 502 },
        );
      }
    } catch (err) {
      console.error("Multipart workflow error:", err);
      return NextResponse.json(
        { error: "Failed to process image", code: "UPSTREAM_ERROR" },
        { status: 500 },
      );
    }
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
      return respondWithNormalized(upstream);
    } catch (nested) {
      const nestedMessage = nested instanceof Error ? nested.message : "";
      if (nestedMessage.includes("ROBOFLOW_API_KEY")) {
        return NextResponse.json(
          {
            error:
              "Roboflow is not configured. Set ROBOFLOW_API_KEY in your environment (e.g. .env.local) and restart the dev server.",
            code: "CONFIG_ERROR",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Roboflow workflow request failed.", code: "UPSTREAM_ERROR" },
        { status: 502 },
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Workflow request failed.";

    return NextResponse.json(
      { error: message, code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }
}
