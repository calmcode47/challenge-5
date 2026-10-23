import { ArrowRight, Calendar, Check, DollarSign, Sparkles, Users } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";

function StepOnePreview(): JSX.Element {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-[var(--color-accent)]">
          Step 1 of 5: Celebration Context
        </span>
        <span className="text-xs text-[var(--color-muted)]">Wedding Planner</span>
      </div>
      <h4 className="text-base font-semibold text-[var(--color-text)]">Ananya & Rohan's Wedding</h4>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-[var(--color-raised)] border border-[var(--color-line-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--color-muted)] mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Date</span>
          </div>
          <span className="font-mono text-[var(--color-text)] font-medium">Oct 24, 2026</span>
        </div>
        <div className="p-3 rounded-lg bg-[var(--color-raised)] border border-[var(--color-line-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--color-muted)] mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Guests</span>
          </div>
          <span className="font-mono text-[var(--color-text)] font-medium">120 Guests</span>
        </div>
        <div className="p-3 rounded-lg bg-[var(--color-raised)] border border-[var(--color-line-subtle)] col-span-2">
          <div className="flex items-center gap-1.5 text-[var(--color-muted)] mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Target Budget</span>
          </div>
          <span className="font-mono text-[var(--color-text)] font-medium">$40,000.00 USD</span>
        </div>
      </div>
    </div>
  );
}

function StepTwoPreview(): JSX.Element {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-[var(--color-success)]">
          Engine Generated Plan
        </span>
        <span className="text-xs font-mono text-[var(--color-muted)]">0 ms latency</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[var(--color-text)]">Catering (30%)</span>
          <span className="text-[var(--color-accent)]">$12,000.00</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--color-raised)] overflow-hidden">
          <div className="h-full bg-[var(--color-accent)] rounded-full w-[30%]" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[var(--color-text)]">Venue (18%)</span>
          <span className="text-[var(--color-violet)]">$7,200.00</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--color-raised)] overflow-hidden">
          <div className="h-full bg-[var(--color-violet)] rounded-full w-[18%]" />
        </div>
      </div>
      <div className="p-2.5 rounded-lg bg-[var(--color-raised)] border border-[var(--color-line-subtle)] flex items-center justify-between text-xs">
        <span className="text-[var(--color-muted)]">First milestone:</span>
        <span className="font-mono text-[var(--color-text)]">Finalize Venue (Day -270)</span>
      </div>
    </div>
  );
}

function StepThreePreview(): JSX.Element {
  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-[var(--color-violet)]">
          AI Enrichment Ideas
        </span>
        <Badge kind="ai">3 Curated</Badge>
      </div>
      <div className="p-3 rounded-lg bg-[var(--color-raised)] border border-[var(--color-line-subtle)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--color-text)]">
            Acoustic Strings & Jazz Duo
          </span>
          <Badge kind="success">Fits budget</Badge>
        </div>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed">
          Why: Tailored for cocktail hour in a banquet hall setting with 120 guests.
        </p>
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-muted)] pt-1 border-t border-[var(--color-line-subtle)]">
          <span>Estimate: $900 – $1,400</span>
          <span>Low effort</span>
        </div>
      </div>
    </div>
  );
}

function StepFourPreview(): JSX.Element {
  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-[var(--color-accent)]">
          Collaborative Assistant
        </span>
        <Badge kind="ai">Suggested Action</Badge>
      </div>
      <div className="p-3 rounded-lg bg-[var(--color-raised)] border border-[var(--color-line-subtle)] space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-accent)] font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Shift $500 from Decor to Photography</span>
        </div>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed">
          Rationale: Your guest count and memories priority justifies an extra photo hour.
        </p>
        <div className="flex items-center gap-2 pt-2">
          <span className="px-2.5 py-1 text-xs rounded bg-[var(--color-accent)] text-[var(--color-bg)] font-medium flex items-center gap-1 select-none">
            <Check className="w-3 h-3" />
            <span>Apply</span>
          </span>
          <span className="text-[11px] text-[var(--color-muted)]">Validated by engine</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Props for ScrollytellingPreview component.
 */
export interface ScrollytellingPreviewProps {
  /** Active step index (0, 1, 2, or 3) */
  readonly activeStep: number;
}

/**
 * Miniature live preview panel rendering authentic UI illustrations
 * corresponding to the active scrollytelling step.
 *
 * @param props - ScrollytellingPreviewProps
 * @returns JSX.Element
 */
export function ScrollytellingPreview({ activeStep }: ScrollytellingPreviewProps): JSX.Element {
  return (
    <Card className="relative overflow-hidden bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-line)] shadow-2xl p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-line-subtle)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-coral)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)]" />
          <span className="ml-2 text-xs font-mono text-[var(--color-muted)]">
            occasio-preview.app
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge kind="demo">Sample</Badge>
          {activeStep >= 1 && <Badge kind="calculated">Calculated</Badge>}
        </div>
      </div>

      <div className="flex-1">
        {activeStep === 0 && <StepOnePreview />}
        {activeStep === 1 && <StepTwoPreview />}
        {activeStep === 2 && <StepThreePreview />}
        {activeStep === 3 && <StepFourPreview />}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--color-line-subtle)] flex items-center justify-between text-xs text-[var(--color-muted)]">
        <span>Step {activeStep + 1} of 4</span>
        <span className="font-mono flex items-center gap-1 text-[var(--color-text)]">
          Interactive Walkthrough <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Card>
  );
}
