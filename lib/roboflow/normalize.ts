function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function base64FromOutputImage(value: unknown): string | null {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  if (!isRecord(value)) {
    return null;
  }
  const direct = value.value ?? value.base64 ?? value.data;
  return typeof direct === "string" && direct.length > 0 ? direct : null;
}

/**
 * Maps variable Roboflow workflow JSON to a stable shape for the frontend.
 */
export function normalizeWorkflowPayload(result: unknown): {
  count: number | null;
  predictions: unknown[];
  annotatedImage: string | null;
} {
  const output =
    isRecord(result) && Array.isArray(result.outputs)
      ? result.outputs[0]
      : Array.isArray(result)
        ? result[0]
        : result;

  if (!isRecord(output)) {
    return { count: null, predictions: [], annotatedImage: null };
  }

  const count =
    typeof output.count_objects === "number" && Number.isFinite(output.count_objects)
      ? output.count_objects
      : null;

  const predictions = Array.isArray(output.predictions) ? output.predictions : [];

  const annotatedImage =
    base64FromOutputImage(output.output_image) ??
    base64FromOutputImage((output as { annotated_image?: unknown }).annotated_image);

  return { count, predictions, annotatedImage };
}
