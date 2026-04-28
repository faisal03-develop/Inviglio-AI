"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/styles/dashboard.module.css";

type SourceMode = "file" | "webcam" | "stream";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function LiveFeed() {
  const [mode, setMode] = useState<SourceMode>("file");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<"video" | "image" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setPreviewKind(file.type.startsWith("video/") ? "video" : "image");
    setIsLoading(false);
  }

  function renderContent() {
    if (mode === "webcam") {
      return (
        <div className={styles.feedPlaceholder}>
          <p>Webcam feed integration point</p>
          <span>Connect browser camera stream here using `getUserMedia`.</span>
        </div>
      );
    }

    if (mode === "stream") {
      return (
        <div className={styles.feedPlaceholder}>
          <label htmlFor="streamUrl" className={styles.streamLabel}>
            CCTV Stream URL
          </label>
          <input
            id="streamUrl"
            className={styles.streamInput}
            value={streamUrl}
            onChange={(event) => setStreamUrl(event.target.value)}
            placeholder="rtsp:// or https:// stream endpoint"
          />
          <span>Use this URL for your linked CCTV source.</span>
        </div>
      );
    }

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
      <div className={styles.feedSourceTabs}>
        <button
          type="button"
          className={`${styles.sourceTab} ${mode === "file" ? styles.sourceTabActive : ""}`}
          onClick={() => setMode("file")}
        >
          File
        </button>
        <button
          type="button"
          className={`${styles.sourceTab} ${mode === "webcam" ? styles.sourceTabActive : ""}`}
          onClick={() => setMode("webcam")}
        >
          Webcam
        </button>
        <button
          type="button"
          className={`${styles.sourceTab} ${mode === "stream" ? styles.sourceTabActive : ""}`}
          onClick={() => setMode("stream")}
        >
          Stream
        </button>
      </div>

      {errorMessage ? <p className={styles.uploadError}>{errorMessage}</p> : null}
      {renderContent()}
    </section>
  );
}
