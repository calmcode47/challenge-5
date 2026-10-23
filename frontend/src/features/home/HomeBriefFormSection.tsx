import { useState, type ReactElement, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { WavyDivider } from "../../components/common/WavyDivider.js";
import { HomeManifestoCard } from "./HomeManifestoCard.js";

interface Glaze {
  name: string;
  dotClass: string;
  activeClass: string;
}

const GLAZES: Glaze[] = [
  { name: "Blush Terracotta", dotClass: "bg-wine-accent", activeClass: "bg-blush-petal" },
  { name: "Sun Honey", dotClass: "bg-butter-sun", activeClass: "bg-butter-sun/40" },
  { name: "Wild Sage", dotClass: "bg-secondary", activeClass: "bg-sage-soft" },
  {
    name: "Deep Burgundy",
    dotClass: "bg-primary-container",
    activeClass: "bg-surface-container-high",
  },
];

function BriefSectionHeader(): ReactElement {
  return (
    <div className="text-center max-w-2xl mx-auto mb-space-xl">
      <h2 className="font-headline-lg text-headline-lg text-wine-deep font-bold">
        Color Makes Every Gathering Feel New
      </h2>
      <WavyDivider className="w-20 h-4 text-wine-accent mx-auto my-1" />
      <p className="font-body-md text-body-md text-text-muted">
        Ceramics and palette pairings that bring warmth, personality, and genuine human connection.
        Start your brief with one gentle gesture.
      </p>
    </div>
  );
}

function GlazeSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-label-sm text-label-sm text-wine-deep uppercase tracking-wider font-semibold">
        Stoneware Glaze Tone
      </span>
      <div className="flex flex-wrap gap-space-xs">
        {GLAZES.map((g) => (
          <button
            key={g.name}
            type="button"
            onClick={() => {
              onSelect(g.name);
            }}
            className={`palette-chip px-space-md py-space-xs rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-xs transition-colors font-medium text-wine-deep ${
              selected === g.name
                ? `${g.activeClass} font-bold`
                : "bg-cream-linen hover:bg-cream-surface"
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${g.dotClass}`} />
            <span>{g.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface SlipFormFieldsProps {
  occasion: string;
  setOccasion: (v: string) => void;
  guestCount: number;
  setGuestCount: (v: number) => void;
  selectedGlaze: string;
  setSelectedGlaze: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}

function OccasionGuestsFields(
  props: Pick<SlipFormFieldsProps, "occasion" | "setOccasion" | "guestCount" | "setGuestCount">
): ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="slip-occasion"
          className="font-label-sm text-label-sm text-wine-deep uppercase tracking-wider font-semibold"
        >
          Occasion
        </label>
        <select
          id="slip-occasion"
          value={props.occasion}
          onChange={(e) => {
            props.setOccasion(e.target.value);
          }}
          className="w-full bg-cream-linen text-wine-deep font-body-md text-body-md px-space-md py-space-xs rounded-xl shadow-xs outline-none focus:ring-2 focus:ring-wine-accent/30"
        >
          <option value="wedding">Petal &amp; Clay Wedding</option>
          <option value="milestone">Sunny 80th Milestone</option>
          <option value="community">Intimate Pottery Studio Feast</option>
          <option value="anniversary">Coastal Terracotta Elopement</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="slip-guests"
          className="font-label-sm text-label-sm text-wine-deep uppercase tracking-wider font-semibold"
        >
          Guest Count
        </label>
        <input
          id="slip-guests"
          type="number"
          min={8}
          max={250}
          value={props.guestCount}
          onChange={(e) => {
            props.setGuestCount(Number(e.target.value) || 8);
          }}
          className="w-full bg-cream-linen text-wine-deep font-body-md text-body-md px-space-md py-space-xs rounded-xl shadow-xs outline-none focus:ring-2 focus:ring-wine-accent/30"
        />
      </div>
    </div>
  );
}

function SlipFormFields(props: SlipFormFieldsProps): ReactElement {
  return (
    <>
      <OccasionGuestsFields
        occasion={props.occasion}
        setOccasion={props.setOccasion}
        guestCount={props.guestCount}
        setGuestCount={props.setGuestCount}
      />
      <GlazeSelector selected={props.selectedGlaze} onSelect={props.setSelectedGlaze} />
      <div className="flex flex-col gap-1">
        <label
          htmlFor="slip-notes"
          className="font-label-sm text-label-sm text-wine-deep uppercase tracking-wider font-semibold"
        >
          Tactile Wishes &amp; Notes
        </label>
        <textarea
          id="slip-notes"
          rows={2}
          value={props.notes}
          onChange={(e) => {
            props.setNotes(e.target.value);
          }}
          placeholder="e.g., Live acoustic guitar during appetizers, low floral arrangements so guests can see each other..."
          className="w-full bg-cream-linen text-wine-deep font-body-md text-body-md p-space-md rounded-xl shadow-xs outline-none focus:ring-2 focus:ring-wine-accent/30"
        />
      </div>
    </>
  );
}

/**
 * Instant celebration slip brief form and studio manifesto card section.
 */
export function HomeBriefFormSection(): ReactElement {
  const navigate = useNavigate();
  const [occasion, setOccasion] = useState("wedding");
  const [guestCount, setGuestCount] = useState(48);
  const [selectedGlaze, setSelectedGlaze] = useState("Blush Terracotta");
  const [notes, setNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState("Est. Craft Time: 3 Seconds");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(`Blueprint drafted for ${String(guestCount)} guests!`);
    setTimeout(() => {
      void navigate(`/plan-wizard?vertical=${occasion}&guests=${String(guestCount)}`);
    }, 1200);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter py-space-xl">
      <div className="w-full bg-cream-linen rounded-[2.5rem] p-space-lg md:p-space-2xl shadow-[0_4px_24px_rgba(122,40,50,0.05)]">
        <BriefSectionHeader />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <div className="lg:col-span-7 bg-cream-surface rounded-[2rem] p-space-lg md:p-space-xl shadow-xs">
            <h3 className="font-headline-sm text-headline-sm text-wine-deep mb-space-md flex items-center gap-2 font-bold">
              <MaterialIcon name="edit_note" size={24} className="text-wine-accent" />
              <span>Instant Celebration Slip</span>
            </h3>

            <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
              <SlipFormFields
                occasion={occasion}
                setOccasion={setOccasion}
                guestCount={guestCount}
                setGuestCount={setGuestCount}
                selectedGlaze={selectedGlaze}
                setSelectedGlaze={setSelectedGlaze}
                notes={notes}
                setNotes={setNotes}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-space-sm rounded-full bg-wine-accent text-cream-linen font-label-lg text-label-lg hover:bg-wine-deep active:scale-95 transition-all shadow-[0_4px_14px_rgba(122,40,50,0.2)] font-bold disabled:opacity-80"
                >
                  <MaterialIcon name="auto_fix_high" size={18} />
                  <span>{isSubmitting ? "Firing Blueprint..." : "Generate Clay Blueprint"}</span>
                </button>
                <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                  <MaterialIcon name="schedule" size={16} className="text-sage-earth" />
                  <span>{statusMessage}</span>
                </span>
              </div>
            </form>
          </div>
          <HomeManifestoCard />
        </div>
      </div>
    </section>
  );
}
