import { useState, type ReactElement } from "react";
import { Header } from "../../components/layout/Header.js";
import { Footer } from "../../components/layout/Footer.js";
import { SearchDialog } from "../../components/common/SearchDialog.js";
import { VaultHero } from "./VaultHero.js";
import { VaultMetrics } from "./VaultMetrics.js";
import { VaultPlansGrid } from "./VaultPlansGrid.js";
import { VaultHygieneSuite } from "./VaultHygieneSuite.js";
import { getStorageUsage, loadPlans, type StoredPlan } from "../../state/persistence.js";

/**
 * My Plans & Clay Vault main sovereign data inventory page.
 */
export function VaultPage(): ReactElement {
  const [plans, setPlans] = useState<StoredPlan[]>(() => loadPlans());
  const [usage, setUsage] = useState(() => getStorageUsage());

  const handleRefresh = (): void => {
    setPlans(loadPlans());
    setUsage(getStorageUsage());
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-blush-petal selection:text-wine-deep">
      <Header />
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)] flex-1">
        <div className="flex flex-col w-full">
          <VaultHero onDataChange={handleRefresh} />
          <div className="w-full bg-cream-linen px-gutter py-space-xl">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-2xl">
              <VaultMetrics plans={plans} storageFormatted={usage.formatted} />
              <VaultPlansGrid plans={plans} />
              <VaultHygieneSuite
                storageQuotaText={`${usage.formatted} / 5,120 KB (${String(usage.percentage)}%)`}
                storagePct={usage.percentage}
                onDataReset={handleRefresh}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <SearchDialog />
    </div>
  );
}

export default VaultPage;
