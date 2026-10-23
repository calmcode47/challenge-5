import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";

/** Props for WizardSensoryStep. */
export interface WizardSensoryStepProps {
  readonly sensoryAda: boolean;
  readonly sensoryAllergen: boolean;
  readonly sensoryPavilion: boolean;
  readonly sensoryAcoustic: boolean;
  readonly onToggleAda: (val: boolean) => void;
  readonly onToggleAllergen: (val: boolean) => void;
  readonly onTogglePavilion: (val: boolean) => void;
  readonly onToggleAcoustic: (val: boolean) => void;
}

interface SensoryCardProps {
  id: string;
  icon: string;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function SensoryToggleCard({
  id,
  icon,
  title,
  desc,
  checked,
  onChange,
}: SensoryCardProps): ReactElement {
  return (
    <div className="bg-cream-linen p-space-md rounded-2xl flex items-start gap-space-sm transition-all hover:bg-cream-surface shadow-sm">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
        className="mt-1 w-5 h-5 rounded text-wine-accent accent-wine-accent cursor-pointer"
      />
      <label htmlFor={id} className="cursor-pointer flex flex-col">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name={icon} size={18} className="text-secondary" />
          <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
            {title}
          </span>
        </div>
        <span className="font-body-sm text-body-sm text-text-muted mt-1">{desc}</span>
      </label>
    </div>
  );
}

function SensoryHeader(): ReactElement {
  return (
    <>
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-space-xs">
          <span className="w-8 h-8 rounded-full bg-wine-accent text-cream-linen flex items-center justify-center font-bold font-label-md text-label-md">
            4
          </span>
          <h2 className="font-headline-md text-headline-md text-wine-deep font-bold">
            Sensory &amp; Accessibility Architecture
          </h2>
        </div>
        <span className="font-label-sm text-label-sm px-space-sm py-space-xs rounded-full bg-sage-soft text-secondary font-semibold">
          Gentle Pacing
        </span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
        Ensure every friend and family member moves through the celebration with physical comfort
        and cognitive calm.
      </p>
    </>
  );
}

/**
 * Step 4 in Plan Wizard: Sensory & Accessibility Architecture toggles.
 */
export function WizardSensoryStep({
  sensoryAda,
  sensoryAllergen,
  sensoryPavilion,
  sensoryAcoustic,
  onToggleAda,
  onToggleAllergen,
  onTogglePavilion,
  onToggleAcoustic,
}: WizardSensoryStepProps): ReactElement {
  return (
    <section className="bg-surface-container-low p-space-xl rounded-[2rem] shadow-sm">
      <SensoryHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <SensoryToggleCard
          id="toggle-ada"
          icon="accessible"
          title="Step-Free ADA Paths"
          desc="Direct unramped access between ceremony arbor, studio dining, and washrooms."
          checked={sensoryAda}
          onChange={onToggleAda}
        />
        <SensoryToggleCard
          id="toggle-allergen"
          icon="restaurant"
          title="Allergen & Dedicated Prep"
          desc="Gluten-free / nut-isolated pottery bakeware and distinct plating stations."
          checked={sensoryAllergen}
          onChange={onToggleAllergen}
        />
        <SensoryToggleCard
          id="toggle-pavilion"
          icon="spa"
          title="Quiet Decompression Pavilion"
          desc="Soft dim lighting, herbal tea bar, and zero amplified audio for sensory reset."
          checked={sensoryPavilion}
          onChange={onTogglePavilion}
        />
        <SensoryToggleCard
          id="toggle-acoustic"
          icon="volume_down"
          title="Acoustic Limiting (<80dB)"
          desc="Live folk acoustics and mindful audio thresholds without piercing PA speakers."
          checked={sensoryAcoustic}
          onChange={onToggleAcoustic}
        />
      </div>
    </section>
  );
}
