/**
 * Roboflow Serverless Workflow API — request/response shapes.
 * @see https://docs.roboflow.com/deploy/serverless-hosted-api-v2
 *
 * Image inputs support `url` (public HTTPS URL) or `base64` (raw base64, no data: prefix).
 */

export type RoboflowImageInput =
  | { type: "url"; value: string }
  | { type: "base64"; value: string };

export type RunWorkflowRequestBody = {
  image: RoboflowImageInput;
};

/**
 * Workflow output is defined by your Roboflow graph; we keep the envelope loose
 * and narrow at call sites when you know your schema.
 */
export type RoboflowWorkflowResponse = Record<string, unknown>;

export type RoboflowClientErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "CONFIG_ERROR"
  | "UPSTREAM_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export class RoboflowClientError extends Error {
  readonly code: RoboflowClientErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    message: string,
    code: RoboflowClientErrorCode,
    status: number,
    details?: unknown,
  ) {
    super(message);
    this.name = "RoboflowClientError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
