import { type KeyboardEvent, type ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import type { WizardVenue } from "./wizardTypes.js";
import { WizardEventDetailsFields } from "./WizardEventDetailsFields.js";
/** Props for WizardCoordinatesStep. */
export interface WizardCoordinatesStepProps {
  readonly title: string;
  readonly notes: string;
  readonly date: string;
  readonly venue: WizardVenue;
  readonly onTitleChange: (title: string) => void;
  readonly onNotesChange: (notes: string) => void;
  readonly onDateChange: (date: string) => void;
  readonly onVenueChange: (venue: WizardVenue) => void;
}
interface VenueOption {
  id: WizardVenue;
  title: string;
  subtitle: string;
  icon: string;
}
const VENUES: VenueOption[] = [
  {
    id: "Botanical Orchard",
    title: "Botanical Orchard",
    subtitle: "Open air, fruit trees & linen canvas canopies",
    icon: "park",
  },
  {
    id: "Ceramic Loft",
    title: "Ceramic Loft",
    subtitle: "Exposed masonry, kiln light & stoneware display",
    icon: "storefront",
  },
  {
    id: "Wildflower Meadow",
    title: "Wildflower Meadow",
    subtitle: "Grassland horizons, acoustic string quartet warmth",
    icon: "filter_vintage",
  },
];
function selectRelativeVenue(
  current: WizardVenue,
  direction: 1 | -1,
  onVenueChange: (venue: WizardVenue) => void
): void {
  const currentIndex = VENUES.findIndex((option) => option.id === current);
  const nextIndex = (currentIndex + direction + VENUES.length) % VENUES.length;
  const next = VENUES[nextIndex];
  if (next) onVenueChange(next.id);
}

function handleVenueKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  current: WizardVenue,
  onVenueChange: (venue: WizardVenue) => void
): void {
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    selectRelativeVenue(current, 1, onVenueChange);
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    selectRelativeVenue(current, -1, onVenueChange);
  }
}

function VenueSelector({
  venue,
  onVenueChange,
}: {
  venue: WizardVenue;
  onVenueChange: (v: WizardVenue) => void;
}): ReactElement {
  return (
    <div className="md:col-span-2 flex flex-col gap-space-xs">
      <span className="font-label-lg text-label-lg text-text-primary font-bold">
        Venue Archetype &amp; Setting
      </span>
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mt-1"
        role="radiogroup"
        aria-label="Venue archetype"
      >
        {VENUES.map((v) => {
          const isChecked = venue === v.id;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={isChecked}
              tabIndex={isChecked ? 0 : -1}
              onKeyDown={(event) => {
                handleVenueKeyDown(event, v.id, onVenueChange);
              }}
              onClick={() => {
                onVenueChange(v.id);
              }}
              className={`p-space-md rounded-xl text-left flex flex-col gap-1 transition-all shadow-sm ${
                isChecked
                  ? "bg-cream-surface shadow-md ring-2 ring-wine-accent/60"
                  : "bg-cream-linen hover:bg-butter-sun/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
                  {v.title}
                </span>
                <MaterialIcon name={v.icon} size={20} className="text-secondary" />
              </div>
              <span className="font-body-sm text-body-sm text-text-muted">{v.subtitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Step 2 in Plan Wizard: Event Coordinates & Moniker settings.
 */
export function WizardCoordinatesStep({
  title,
  notes,
  date,
  venue,
  onTitleChange,
  onNotesChange,
  onDateChange,
  onVenueChange,
}: WizardCoordinatesStepProps): ReactElement {
  return (
    <section className="bg-surface-container p-space-xl rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-space-xs">
          <span className="w-8 h-8 rounded-full bg-wine-accent text-cream-linen flex items-center justify-center font-bold font-label-md text-label-md">
            2
          </span>
          <h2 className="font-headline-md text-headline-md text-wine-deep font-bold">
            Event Coordinates &amp; Moniker
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-text-muted font-medium">
          Temporal Anchor
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mt-space-md">
        <WizardEventDetailsFields
          title={title}
          notes={notes}
          date={date}
          onTitleChange={onTitleChange}
          onNotesChange={onNotesChange}
          onDateChange={onDateChange}
        />
        <VenueSelector venue={venue} onVenueChange={onVenueChange} />
      </div>
    </section>
  );
}
