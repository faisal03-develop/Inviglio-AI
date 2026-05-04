import { MAX_IMAGE_BYTES } from "@/lib/roboflow/constants";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Reads a File into raw base64 suitable for Roboflow `type: "base64"`. */
export async function fileToRoboflowBase64(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`File is too large (max ${MAX_IMAGE_BYTES} bytes).`);
  }

  const buffer = await file.arrayBuffer();
  return arrayBufferToBase64(buffer);
}
