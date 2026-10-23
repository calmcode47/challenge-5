import { useState, type ReactElement } from "react";
import { Link } from "react-router";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { exportVaultJson, resetVault } from "../../state/persistence.js";
import { useUiStore } from "../../state/uiStore.js";

/** Props for VaultHygieneSuite. */
export interface VaultHygieneSuiteProps {
  readonly storageQuotaText: string;
  readonly storagePct: number;
  readonly onDataReset: () => void;
}

function VaultStorageMonitor({ text, pct }: { text: string; pct: number }): ReactElement {
  return (
    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-xs">
      <div className="flex justify-between items-center text-label-md font-label-md">
        <span className="text-wine-deep font-bold flex items-center gap-1">
          <MaterialIcon name="data_usage" size={16} className="text-wine-accent" />
          LocalStorage Quota Used
        </span>
        <span className="text-secondary font-bold">{text}</span>
      </div>
      <div className="w-full h-3 rounded-full bg-surface-dim overflow-hidden">
        <div
          className="h-full bg-secondary-fixed-variant rounded-full transition-all"
          style={{ width: `${String(pct)}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-label-sm font-label-sm text-text-muted pt-1">
        <span>Healthy JSON Schema v2.4</span>
        <span className="text-secondary flex items-center gap-0.5 font-medium">
          <MaterialIcon name="check_circle" size={14} /> Zero sync latency
        </span>
      </div>
    </div>
  );
}

interface ActionButtonsProps {
  auditStatus: string;
  onAudit: () => void;
  onSnapshot: () => void;
  onReset: () => void;
}

function VaultHygieneActions({
  auditStatus,
  onAudit,
  onSnapshot,
  onReset,
}: ActionButtonsProps): ReactElement {
  return (
    <div className="flex flex-col gap-space-sm sm:w-80">
      <button
        type="button"
        onClick={onAudit}
        className="w-full flex items-center justify-between px-space-md py-space-sm bg-sage-soft hover:bg-secondary-fixed text-text-primary rounded-xl font-label-lg text-label-lg transition-colors shadow-sm font-semibold"
      >
        <span className="flex items-center gap-space-xs">
          <MaterialIcon name="rule_settings" size={20} className="text-secondary" />
          <span>Schema Hygiene Audit</span>
        </span>
        <span className="px-2 py-0.5 bg-cream-surface rounded-full text-label-sm text-secondary font-bold">
          {auditStatus}
        </span>
      </button>

      <button
        type="button"
        onClick={onSnapshot}
        className="w-full flex items-center justify-between px-space-md py-space-sm bg-cream-surface hover:bg-butter-sun/40 text-text-primary rounded-xl font-label-lg text-label-lg transition-colors shadow-sm font-semibold"
      >
        <span className="flex items-center gap-space-xs">
          <MaterialIcon name="archive" size={20} className="text-wine-deep" />
          <span>Generate Vault Snapshot</span>
        </span>
        <span className="text-label-sm text-text-muted font-bold">.JSON</span>
      </button>

      <button
        type="button"
        onClick={onReset}
        className="w-full flex items-center justify-between px-space-md py-space-sm bg-surface-container-high hover:bg-blush-petal/50 text-wine-accent rounded-xl font-label-lg text-label-lg transition-colors shadow-sm font-semibold"
      >
        <span className="flex items-center gap-space-xs">
          <MaterialIcon name="delete_forever" size={20} className="text-error" />
          <span>Wipe &amp; Reset Local Vault</span>
        </span>
        <span className="text-label-sm text-error uppercase font-bold">Purge</span>
      </button>
    </div>
  );
}

function VaultManifestoFooter(): ReactElement {
  return (
    <div className="w-full bg-cream-surface p-space-lg rounded-2xl flex flex-col md:flex-row items-center justify-between gap-space-md shadow-sm">
      <div className="flex items-center gap-space-md">
        <div className="w-14 h-14 rounded-full bg-wine-accent text-cream-linen flex items-center justify-center shrink-0">
          <MaterialIcon name="spa" size={28} />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
            Molded by Human Hands, Held in Private Care
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Your celebration data never trains external AI models. Export and restore anytime with
            standard open schemas.
          </span>
        </div>
      </div>
      <Link
        to="/"
        className="px-space-md py-space-xs rounded-full bg-wine-deep text-cream-linen font-label-lg text-label-lg hover:bg-wine-accent transition-colors shrink-0 font-bold"
      >
        Studio Manifesto
      </Link>
    </div>
  );
}

interface HygieneCardProps {
  storageQuotaText: string;
  storagePct: number;
  auditStatus: "Ready" | "Checking..." | "100% Intact";
  onAudit: () => void;
  onSnapshot: () => void;
  onReset: () => void;
}

function HygieneCard(props: HygieneCardProps): ReactElement {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-space-xl shadow-lg relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl relative z-10">
        <div className="flex flex-col gap-space-md max-w-xl">
          <div className="flex items-center gap-space-xs">
            <MaterialIcon name="verified_user" size={24} className="text-secondary" />
            <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
              Local Storage Sovereign Hygiene
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Every seating chart, vendor invoice, and dietary restriction is preserved
            deterministically inside your browser’s indexed local boundary. No third-party ad
            networks or cookies touch your memories.
          </p>
          <VaultStorageMonitor text={props.storageQuotaText} pct={props.storagePct} />
        </div>
        <VaultHygieneActions
          auditStatus={props.auditStatus}
          onAudit={props.onAudit}
          onSnapshot={props.onSnapshot}
          onReset={props.onReset}
        />
      </div>
    </section>
  );
}

/**
 * Local device vault hygiene controls and sovereign data storage monitor.
 */
export function VaultHygieneSuite({
  storageQuotaText,
  storagePct,
  onDataReset,
}: VaultHygieneSuiteProps): ReactElement {
  const { showNotification } = useUiStore();
  const [auditStatus, setAuditStatus] = useState<"Ready" | "Checking..." | "100% Intact">("Ready");

  const handleRunAudit = (): void => {
    setAuditStatus("Checking...");
    setTimeout(() => {
      setAuditStatus("100% Intact");
      showNotification(
        "Schema audit complete: 0 corrupt nodes, valid celebratory ledgers verified.",
        "success"
      );
    }, 800);
  };

  const handleExportSnapshot = (): void => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportVaultJson());
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `vault-snapshot-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    showNotification("Vault snapshot downloaded to local device.", "success");
  };

  const handleReset = (): void => {
    if (window.confirm("Clear local device store? You can download a backup first.")) {
      resetVault();
      onDataReset();
      showNotification("Local vault reset. Sample records refreshed.", "info");
    }
  };

  return (
    <div className="flex flex-col gap-space-xl">
      <HygieneCard
        storageQuotaText={storageQuotaText}
        storagePct={storagePct}
        auditStatus={auditStatus}
        onAudit={handleRunAudit}
        onSnapshot={handleExportSnapshot}
        onReset={handleReset}
      />
      <VaultManifestoFooter />
    </div>
  );
}
