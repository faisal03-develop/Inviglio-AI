"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useWorkflowMetrics } from "@/contexts/WorkflowMetricsContext";
import type { WorkflowProxySuccess } from "@/lib/roboflow/types";
import styles from "@/styles/productDetector.module.css";

function isProxySuccess(data: unknown): data is WorkflowProxySuccess {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as WorkflowProxySuccess).success === true
  );
}

function annotatedSrc(raw: string): string {
  return raw.startsWith("data:") ? raw : `data:image/jpeg;base64,${raw}`;
}

export default function ProductDetector() {
  const { recordAnalysis } = useWorkflowMetrics();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkflowProxySuccess | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      return;
    }

    setFile(selected);
    setPreview((prev) => {
      if (prev?.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return URL.createObjectURL(selected);
    });
    setResult(null);
    setError(null);
    e.currentTarget.value = "";
  };

  const handleAnalyze = async () => {
    if (!file) {
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/roboflow/workflow", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      const data: unknown = await res.json();

      if (!res.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Analysis failed";
        throw new Error(message);
      }

      if (!isProxySuccess(data)) {
        throw new Error("Unexpected response from server.");
      }

      setResult(data);
      recordAnalysis(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const displayCount =
    result?.count !== null && result?.count !== undefined
      ? String(result.count)
      : result?.predictions?.length
        ? String(result.predictions.length)
        : "—";

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Product Detector</h1>

      <input
        id={fileInputId}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInputHidden}
      />

      <div className={styles.chooseRow}>
        <button
          type="button"
          className={styles.chooseButton}
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? "Choose a different image" : "Choose image"}
        </button>
        {file ? (
          <span className={styles.fileName} title={file.name}>
            {file.name}
          </span>
        ) : (
          <span className={styles.chooseHint}>Select a photo to analyze</span>
        )}
      </div>

      {preview ? (
        <div>
          <p className={styles.previewLabel}>Original image</p>
          {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob preview */}
          <img src={preview} alt="Preview" className={styles.previewImg} />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void handleAnalyze()}
        disabled={!file || loading}
        className={styles.analyzeButton}
      >
        {loading ? "Running workflow…" : "Detect Products"}
      </button>

      {error ? <div className={styles.errorBox}>{error}</div> : null}

      {result ? (
        <div className={styles.results}>
          <div className={styles.countCard}>
            <p className={styles.countText}>Products found: {displayCount}</p>
          </div>

          {result.annotatedImage ? (
            <div>
              <p className={styles.visLabel}>Workflow visualization</p>
              {/* eslint-disable-next-line @next/next/no-img-element -- workflow base64 output */}
              <img
                src={annotatedSrc(result.annotatedImage)}
                alt="Annotated result"
                className={styles.visImg}
              />
            </div>
          ) : null}

          <details>
            <summary>View raw predictions</summary>
            <pre className={styles.pre}>{JSON.stringify(result.predictions, null, 2)}</pre>
          </details>

          <button
            type="button"
            className={styles.afterResultsButton}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload another photo to test
          </button>
        </div>
      ) : null}
    </div>
  );
}
