"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/styles/dashboard.module.css";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function LiveFeed() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<"video" | "image" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      {renderContent()}
    </section>
  );
}
