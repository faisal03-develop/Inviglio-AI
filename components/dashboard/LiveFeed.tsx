"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/styles/dashboard.module.css";
import { useRoboflowWorkflow } from "@/hooks/useRoboflowWorkflow";
import { fileToRoboflowBase64 } from "@/lib/roboflow/image";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function LiveFeed() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<"video" | "image" | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: workflowResult, error: workflowError, isLoading: workflowLoading, run, reset } =
    useRoboflowWorkflow();

  const hasPreview = useMemo(() => Boolean(previewUrl), [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

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

    try {
      const value = await fileToRoboflowBase64(selectedImageFile);
      await run({ image: { type: "base64", value } });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not read image.");
    }
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
  }

  function renderContent() {
    if (isLoading) {
      return <div className={styles.feedPlaceholder}>Loading media preview...</div>;
    }

    if (hasPreview && previewUrl) {
      return (
        <div className={styles.previewWrap}>
          {previewKind === "video" ? (
            <video src={previewUrl} controls autoPlay muted className={styles.previewMedia} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- blob preview URL is not compatible with next/image optimization.
            <img src={previewUrl} alt="Uploaded feed preview" className={styles.previewMedia} />
          )}
        </div>
      );
    }

    return (
      <label className={styles.uploaderArea}>
        <input
          type="file"
          accept=".mp4,.webm,.mov,.jpg,.jpeg,.png,.webp"
          className={styles.fileInput}
          onChange={(event) => handleFileSelection(event.target.files?.[0])}
        />
        <div className={styles.uploadInner}>
          <p>Upload a short video or image</p>
          <span>Supports mp4, mov, jpg, jpeg, png, webp (20s recommended).</span>
        </div>
      </label>
    );
  }

  return (
    <section className={styles.liveFeed}>
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
            Sends the image as base64 (no API key in the browser).
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
        {workflowResult ? (
          <pre className={styles.workflowResult}>
            {JSON.stringify(workflowResult, null, 2)}
          </pre>
        ) : null}
      </div>
    </section>
  );
}
