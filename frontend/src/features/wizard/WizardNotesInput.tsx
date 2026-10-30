import type { ReactElement } from "react";

export interface WizardNotesInputProps {
  readonly notes: string;
  readonly onNotesChange: (notes: string) => void;
}

/** Collects optional, non-sensitive priorities that can make an event brief more relevant. */
export function WizardNotesInput({ notes, onNotesChange }: WizardNotesInputProps): ReactElement {
  return (
    <div className="flex flex-col gap-space-xs md:col-span-2">
      <label
        htmlFor="event-notes-input"
        className="font-label-lg text-label-lg text-text-primary font-bold"
      >
        Planning Priorities <span className="font-normal text-text-muted">(optional)</span>
      </label>
      <textarea
        id="event-notes-input"
        value={notes}
        maxLength={1500}
        rows={3}
        onChange={(event) => {
          onNotesChange(event.target.value);
        }}
        placeholder="E.g., honour a family tradition, include children, or reduce waste."
        className="w-full resize-y rounded-xl bg-cream-linen px-4 py-3 text-text-primary font-body-md text-body-md shadow-inner focus:outline-none focus:ring-2 focus:ring-wine-accent/40"
        aria-describedby="event-notes-help"
      />
      <span id="event-notes-help" className="font-label-sm text-label-sm text-text-muted">
        Used only to shape this plan. Avoid entering private or sensitive details.
      </span>
    </div>
  );
}
