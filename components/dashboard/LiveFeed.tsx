"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "@/styles/dashboard.module.css";
import { useWorkflowMetrics } from "@/contexts/WorkflowMetricsContext";
import { useRoboflowWorkflow } from "@/hooks/useRoboflowWorkflow";
import { isWorkflowProxySuccess } from "@/lib/roboflow/guards";
import type { RoboflowWorkflowResponse } from "@/lib/roboflow/types";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function getWorkflowDetectionCount(value: unknown): number | null {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (!isRecord(value)) {
    return null;
  }

  if (value.success === true && typeof value.count === "number") {
    return value.count;
  }

  const directCountKeys = ["count", "total", "prediction_count", "predictions_count"];
  for (const key of directCountKeys) {
    const candidate = value[key];
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
  }

  const arrayKeys = ["predictions", "detections", "items", "results"];
  for (const key of arrayKeys) {
    const candidate = value[key];
    if (Array.isArray(candidate)) {
      return candidate.length;
    }
  }

  for (const nestedValue of Object.values(value)) {
    const nestedCount = getWorkflowDetectionCount(nestedValue);
    if (nestedCount !== null) {
      return nestedCount;
    }
  }

  return null;
}

function revokeIfBlobUrl(url: string | null) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function LiveFeed() {
  const { recordAnalysis } = useWorkflowMetrics();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<"video" | "image" | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: workflowResult, error: workflowError, isLoading: workflowLoading, run, reset } =
    useRoboflowWorkflow();

  const hasPreview = useMemo(() => Boolean(previewUrl), [previewUrl]);
  const detectionCount = useMemo(
    () => getWorkflowDetectionCount(workflowResult as RoboflowWorkflowResponse | null),
    [workflowResult],
  );

  const annotatedImageSrc = useMemo(() => {
    if (!workflowResult || !isRecord(workflowResult)) {
      return null;
    }
    if (workflowResult.success !== true) {
      return null;
    }
    const raw = workflowResult.annotatedImage;
    if (typeof raw !== "string" || !raw.length) {
      return null;
    }
    return raw.startsWith("data:") ? raw : `data:image/jpeg;base64,${raw}`;
  }, [workflowResult]);

  useEffect(() => {
    return () => {
      revokeIfBlobUrl(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (workflowResult && isWorkflowProxySuccess(workflowResult)) {
      recordAnalysis(workflowResult);
    }
  }, [workflowResult, recordAnalysis]);

  function validateFile(file: File) {
    const accepted = [...ACCEPTED_VIDEO_TYPES, ...ACCEPTED_IMAGE_TYPES];
    return accepted.includes(file.type);
  }

  function handleFileSelection(file?: File) {
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      setErrorMessage("Unsupported file type. Use mp4, webm, mov, jpg, png, or webp.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    revokeIfBlobUrl(previewUrl);

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    const isVideo = file.type.startsWith("video/");
    setPreviewKind(isVideo ? "video" : "image");
    setSelectedImageFile(isVideo ? null : file);
    reset();
    setImageUrlInput("");
    setIsLoading(false);
  }

  async function handleRunWorkflowOnUpload() {
    if (!selectedImageFile) {
      return;
    }

    setErrorMessage(null);
    await run(selectedImageFile);
  }

  async function handleRunWorkflowOnUrl() {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) {
      setErrorMessage("Enter an https image URL.");
      return;
    }

    setErrorMessage(null);
    try {
      const url = new URL(trimmed);
      if (url.protocol !== "https:") {
        setErrorMessage("Image URL must use https.");
        return;
      }
    } catch {
      setErrorMessage("Invalid image URL.");
      return;
    }

    await run({ image: { type: "url", value: trimmed } });
    revokeIfBlobUrl(previewUrl);
    setPreviewUrl(trimmed);
    setPreviewKind("image");
    setSelectedImageFile(null);
  }

  function renderContent() {
    if (isLoading) {
      return <div className={styles.feedPlaceholder}>Loading media preview...</div>;
    }

    if (hasPreview && previewUrl) {
      return (
        <div>
          <div className={styles.previewWrap}>
            {previewKind === "video" ? (
              <video src={previewUrl} controls autoPlay muted className={styles.previewMedia} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- blob preview URL is not compatible with next/image optimization.
              <img src={previewUrl} alt="Uploaded feed preview" className={styles.previewMedia} />
            )}
          </div>
          <div className={styles.previewActions}>
            <button
              type="button"
              className={styles.previewPickAnother}
              onClick={() => fileInputRef.current?.click()}
            >
              Choose another image or video
            </button>
          </div>
        </div>
      );
    }

    return (
      <label htmlFor={fileInputId} className={styles.uploaderArea}>
        <div className={styles.uploadInner}>
          <p>Upload a short video or image</p>
          <span>Supports mp4, mov, jpg, jpeg, png, webp (20s recommended).</span>
        </div>
      </label>
    );
  }

  return (
    <section className={styles.liveFeed}>
      <input
        id={fileInputId}
        ref={fileInputRef}
        type="file"
        accept=".mp4,.webm,.mov,.jpg,.jpeg,.png,.webp"
        className={styles.fileInput}
        onChange={(event) => {
          handleFileSelection(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
      {errorMessage ? <p className={styles.uploadError}>{errorMessage}</p> : null}
      {workflowError ? <p className={styles.uploadError}>{workflowError}</p> : null}
      {renderContent()}
      <div className={styles.workflowPanel}>
        <p className={styles.workflowPanelTitle}>Roboflow workflow</p>
        <div className={styles.workflowRow}>
          <button
            type="button"
            className={styles.workflowPrimary}
            disabled={!selectedImageFile || workflowLoading}
            onClick={() => void handleRunWorkflowOnUpload()}
          >
            {workflowLoading ? "Running…" : "Run on uploaded image"}
          </button>
          <span className={styles.workflowHint}>
            Uploads the file to the server proxy; the API key never leaves the server.
          </span>
        </div>
        <div className={styles.workflowUrlRow}>
          <input
            type="url"
            className={styles.workflowUrlInput}
            placeholder="https://… (public image URL)"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            disabled={workflowLoading}
          />
          <button
            type="button"
            className={styles.workflowSecondary}
            disabled={workflowLoading}
            onClick={() => void handleRunWorkflowOnUrl()}
          >
            Run on URL
          </button>
        </div>
        {workflowResult && detectionCount !== null ? (
          <p className={styles.workflowResult}>Detected count: {detectionCount}</p>
        ) : null}
        {annotatedImageSrc ? (
          <div className={styles.workflowAnnotatedWrap}>
            <p className={styles.workflowAnnotatedLabel}>Annotated output</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic base64/data URL from workflow */}
            <img
              src={annotatedImageSrc}
              alt="Roboflow annotated result"
              className={styles.workflowAnnotatedImage}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
