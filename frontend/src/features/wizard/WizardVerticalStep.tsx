import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import type { WizardVertical } from "./wizardTypes.js";

/** Props for WizardVerticalStep. */
export interface WizardVerticalStepProps {
  readonly selectedVertical: WizardVertical;
  readonly onSelectVertical: (vertical: WizardVertical) => void;
}

interface VerticalOption {
  id: WizardVertical;
  title: string;
  subtitle: string;
  icon: string;
  bgClass: string;
  iconBgClass: string;
  iconColorClass: string;
}

const VERTICALS: VerticalOption[] = [
  {
    id: "wedding",
    title: "Wedding",
    subtitle: "Elopements & Vows",
    icon: "favorite",
    bgClass: "bg-blush-petal/35 hover:bg-blush-petal/60",
    iconBgClass: "bg-cream-linen",
    iconColorClass: "text-wine-accent",
  },
  {
    id: "milestone",
    title: "Milestone",
    subtitle: "Birthdays & Jubilees",
    icon: "cake",
    bgClass: "bg-butter-sun/25 hover:bg-butter-sun/45",
    iconBgClass: "bg-cream-linen",
    iconColorClass: "text-wine-accent",
  },
  {
    id: "community",
    title: "Communal Feast",
    subtitle: "Studio Table & Farm",
    icon: "soup_kitchen",
    bgClass: "bg-secondary-container/60 hover:bg-secondary-container",
    iconBgClass: "bg-cream-linen",
    iconColorClass: "text-secondary",
  },
  {
    id: "anniversary",
    title: "Anniversary",
    subtitle: "Salon & Retrospective",
    icon: "wine_bar",
    bgClass: "bg-blush-deep/20 hover:bg-blush-deep/40",
    iconBgClass: "bg-cream-linen",
    iconColorClass: "text-wine-accent",
  },
];

function VerticalCard({
  item,
  isActive,
  onSelect,
}: {
  item: VerticalOption;
  isActive: boolean;
  onSelect: (v: WizardVertical) => void;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={() => {
        onSelect(item.id);
      }}
      className={`group text-left p-space-md rounded-t-[3.5rem] rounded-b-2xl ${item.bgClass} transition-all flex flex-col items-center justify-between min-h-[260px] shadow-sm transform hover:-translate-y-1 ${
        isActive ? "ring-2 ring-wine-accent shadow-md" : ""
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full ${item.iconBgClass} flex items-center justify-center ${item.iconColorClass} mt-2 shadow-sm`}
      >
        <MaterialIcon name={item.icon} size={32} />
      </div>
      <div className="text-center mt-space-md">
        <span className="block font-headline-sm text-headline-sm text-wine-deep font-bold">
          {item.title}
        </span>
        <span className="block font-body-sm text-body-sm text-on-surface-variant mt-1">
          {item.subtitle}
        </span>
      </div>
      <div className="w-full mt-space-md pt-space-xs border-t-0 flex items-center justify-center">
        <span
          className={`chip-status inline-flex items-center gap-1 font-label-sm text-label-sm px-space-sm py-1 rounded-full ${
            isActive
              ? "bg-wine-deep text-cream-linen font-bold shadow-xs"
              : "bg-cream-linen/80 text-on-surface-variant font-medium"
          }`}
        >
          {isActive && <MaterialIcon name="check_circle" size={14} />}
          <span>{isActive ? "Active" : "Select"}</span>
        </span>
      </div>
    </button>
  );
}

/**
 * Step 1 in Plan Wizard: Select Celebration Vertical Archetype.
 */
export function WizardVerticalStep({
  selectedVertical,
  onSelectVertical,
}: WizardVerticalStepProps): ReactElement {
  return (
    <section className="bg-surface-container-low p-space-xl rounded-[2rem] shadow-sm relative">
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-space-xs">
          <span className="w-8 h-8 rounded-full bg-wine-accent text-cream-linen flex items-center justify-center font-bold font-label-md text-label-md">
            1
          </span>
          <h2 className="font-headline-md text-headline-md text-wine-deep font-bold">
            Select Celebration Vertical
          </h2>
        </div>
        <span className="font-label-sm text-label-sm px-space-sm py-space-xs rounded-full bg-secondary-container text-secondary font-semibold">
          Artisanal Archetype
        </span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
        Choose the clay mold that grounds the celebration. Each vertical shapes guest cadences,
        lighting, and table arrangement.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
        {VERTICALS.map((v) => (
          <VerticalCard
            key={v.id}
            item={v}
            isActive={selectedVertical === v.id}
            onSelect={onSelectVertical}
          />
        ))}
      </div>
    </section>
  );
}
