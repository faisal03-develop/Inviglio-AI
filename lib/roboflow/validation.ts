import { MAX_IMAGE_BYTES } from "@/lib/roboflow/constants";
import type { RoboflowImageInput, RunWorkflowRequestBody } from "@/lib/roboflow/types";

function isHttpsUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseWorkflowBody(json: unknown): RunWorkflowRequestBody {
  if (!json || typeof json !== "object") {
    throw new Error("Body must be a JSON object.");
  }

  const image = (json as { image?: unknown }).image;
  if (!image || typeof image !== "object") {
    throw new Error('Missing or invalid "image" field.');
  }

  const type = (image as { type?: unknown }).type;
  const value = (image as { value?: unknown }).value;

  if (type !== "url" && type !== "base64") {
    throw new Error('image.type must be "url" or "base64".');
  }

  if (typeof value !== "string" || value.length === 0) {
    throw new Error("image.value must be a non-empty string.");
  }

  let normalized: RoboflowImageInput;

  if (type === "url") {
    if (!isHttpsUrl(value)) {
      throw new Error("image URL must use https.");
    }
    normalized = { type: "url", value };
  } else {
    const approxBytes = Math.floor((value.length * 3) / 4);
    if (approxBytes > MAX_IMAGE_BYTES) {
      throw new Error(`Image payload is too large (max ~${MAX_IMAGE_BYTES} bytes decoded).`);
    }
    normalized = { type: "base64", value };
  }

  return { image: normalized };
}
