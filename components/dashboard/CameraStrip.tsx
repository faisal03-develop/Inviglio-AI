import type { CameraThumb } from "@/constants/dashboard";
import styles from "@/styles/dashboard.module.css";

type CameraStripProps = {
  cameras: CameraThumb[];
};

export function CameraStrip({ cameras }: CameraStripProps) {
  return (
    <div className={styles.cameraStrip}>
      {cameras.map((camera) => (
        <article key={camera.id} className={styles.cameraCard}>
          <div className={styles.cameraPreview} aria-hidden="true" />
          <p>{camera.label}</p>
          {camera.muted ? <span className={styles.mutedText}>SIGNAL LOST</span> : null}
        </article>
      ))}
    </div>
  );
}
