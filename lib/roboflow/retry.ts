import {
  INITIAL_BACKOFF_MS,
  MAX_RETRIES,
  RETRYABLE_STATUS,
} from "@/lib/roboflow/constants";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type FetchLike = typeof fetch;

/**
 * Retries transient failures: network errors and selected HTTP status codes.
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  fetchImpl: FetchLike = fetch,
): Promise<Response> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt < MAX_RETRIES) {
    try {
      const res = await fetchImpl(input, init);
      if (!RETRYABLE_STATUS.has(res.status) || attempt === MAX_RETRIES - 1) {
        return res;
      }
    } catch (err) {
      lastError = err;
      if (attempt === MAX_RETRIES - 1) {
        throw err;
      }
    }

    const backoff = INITIAL_BACKOFF_MS * 2 ** attempt;
    await sleep(backoff);
    attempt += 1;
  }

  throw lastError ?? new Error("fetchWithRetry failed.");
}
