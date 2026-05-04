/** Decoded image size ceiling before base64 encoding (~4 MB) to stay under hosted payload limits. */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/** Default workflow URL from deployment; override with ROBOFLOW_WORKFLOW_URL. */
export const DEFAULT_WORKFLOW_URL =
  "https://serverless.roboflow.com/pedicot681-poisonword-com/workflows/detect-count-and-visualize";

export const RETRYABLE_STATUS = new Set([429, 502, 503, 504]);

export const MAX_RETRIES = 3;

export const INITIAL_BACKOFF_MS = 400;
