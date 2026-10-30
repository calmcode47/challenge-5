import type { ChangeEvent, ReactElement } from "react";
import { Link } from "react-router";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { DaisySvg } from "../../components/common/DaisySvg.js";
import { exportVaultJson, importVaultJson } from "../../state/persistence.js";
import { useUiStore } from "../../state/uiStore.js";

/** Props for VaultHero. */
export interface VaultHeroProps {
  readonly onDataChange: () => void;
}

function VaultActionButtons({ onDataChange }: { onDataChange: () => void }): ReactElement {
  const { showNotification } = useUiStore();

  const handleExport = (): void => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportVaultJson());
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute(
      "download",
      `soft-clay-vault-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    showNotification(
      "Artisanal Vault (.JSON) snapshot generated and saved to your device.",
      "success"
    );
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        const count = importVaultJson(text);
        onDataChange();
        showNotification(
          `Restored ${String(count)} celebration records from ${file.name}.`,
          "success"
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-wrap items-center gap-space-sm">
      <Link
        to="/plan-wizard"
        className="flex items-center gap-space-xs px-space-md py-space-sm bg-butter-sun text-text-primary rounded-full font-label-lg text-label-lg shadow-md hover:bg-butter-sun/90 transition-all hover:scale-105 active:scale-95 font-bold"
      >
        <MaterialIcon name="add_circle" size={18} />
        <span>+ Craft Celebration</span>
      </Link>
      <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-space-xs px-space-md py-space-sm bg-wine-deep/60 hover:bg-wine-deep text-cream-linen rounded-full font-label-lg text-label-lg transition-colors shadow-sm font-semibold"
      >
        <MaterialIcon name="file_download" size={18} />
        <span>Export Vault (.JSON)</span>
      </button>
      <label className="cursor-pointer flex items-center gap-space-xs px-space-md py-space-sm bg-wine-deep/60 hover:bg-wine-deep text-cream-linen rounded-full font-label-lg text-label-lg transition-colors shadow-sm font-semibold">
        <MaterialIcon name="file_upload" size={18} />
        <span>Device Backup</span>
        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
      </label>
    </div>
  );
}

/**
 * Top ribbon section and action controls for My Plans & Vault.
 */
export function VaultHero({ onDataChange }: VaultHeroProps): ReactElement {
  return (
    <div className="relative w-full bg-wine-accent text-cream-linen px-gutter pt-space-xl pb-space-2xl overflow-hidden shadow-xl">
      <div className="absolute -top-6 -left-6 w-32 h-32 opacity-20 pointer-events-none text-butter-sun">
        <DaisySvg size={100} petalColor="#F3CE72" centerColor="#FBF7EE" />
      </div>
      <div className="absolute -top-10 -right-8 w-44 h-44 opacity-25 pointer-events-none text-blush-petal">
        <DaisySvg size={120} petalColor="#F2BEB9" centerColor="#5C1D24" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg relative z-10">
        <div className="max-w-2xl flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-space-xs bg-wine-deep/40 px-space-sm py-1 rounded-full text-blush-petal text-label-sm font-label-sm w-fit font-semibold">
            <MaterialIcon name="shield_lock" size={16} className="text-butter-sun" />
            <span>100% Client-Side Sovereign Vault</span>
          </div>
          <h1
            tabIndex={-1}
            className="font-headline-xl text-headline-xl tracking-tight text-cream-linen font-bold"
          >
            My Saved Celebrations &amp; Clay Vault
          </h1>
          <p className="font-body-md text-body-md text-cream-linen/80 max-w-xl">
            All plans, seating maps, and deterministic cost ledgers reside strictly in your local
            device cache. Zero telemetry, pure artisanal autonomy.
          </p>
        </div>

        <VaultActionButtons onDataChange={onDataChange} />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(circle at 12px 16px, transparent 12px, #FBF7EE 13px)",
          backgroundSize: "24px 16px",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
