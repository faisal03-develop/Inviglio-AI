import styles from "@/styles/dashboard.module.css";

type StatusPillProps = {
  text: string;
  tone?: "success" | "danger" | "neutral";
};

export function StatusPill({ text, tone = "neutral" }: StatusPillProps) {
  const toneClassName =
    tone === "success"
      ? styles.pillSuccess
      : tone === "danger"
        ? styles.pillDanger
        : styles.pillNeutral;

  return <span className={`${styles.pill} ${toneClassName}`}>{text}</span>;
}
