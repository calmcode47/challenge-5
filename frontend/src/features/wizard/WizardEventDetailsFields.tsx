import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { WizardNotesInput } from "./WizardNotesInput.js";

export interface WizardEventDetailsFieldsProps {
  readonly title: string;
  readonly notes: string;
  readonly date: string;
  readonly onTitleChange: (value: string) => void;
  readonly onNotesChange: (value: string) => void;
  readonly onDateChange: (value: string) => void;
}

function TitleInput({
  title,
  onTitleChange,
}: Pick<WizardEventDetailsFieldsProps, "title" | "onTitleChange">): ReactElement {
  return (
    <div className="flex flex-col gap-space-xs">
      <label
        htmlFor="event-moniker-input"
        className="font-label-lg text-label-lg text-text-primary font-bold"
      >
        Celebration Title / Moniker
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-secondary">
          <MaterialIcon name="edit_note" size={20} />
        </span>
        <input
          id="event-moniker-input"
          type="text"
          value={title}
          minLength={2}
          maxLength={120}
          required
          onChange={(event) => {
            onTitleChange(event.target.value);
          }}
          placeholder="E.g., Julian's Ceramic Solstice Dinner"
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream-linen text-text-primary font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-wine-accent/40 shadow-inner"
        />
      </div>
      <span className="font-label-sm text-label-sm text-text-muted">
        Inscribed on invitations and table menus
      </span>
    </div>
  );
}

function DateInput({
  date,
  onDateChange,
}: Pick<WizardEventDetailsFieldsProps, "date" | "onDateChange">): ReactElement {
  return (
    <div className="flex flex-col gap-space-xs">
      <label
        htmlFor="event-date-input"
        className="font-label-lg text-label-lg text-text-primary font-bold"
      >
        Gathering Date
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-secondary">
          <MaterialIcon name="calendar_today" size={20} />
        </span>
        <input
          id="event-date-input"
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          value={date}
          required
          onChange={(event) => {
            onDateChange(event.target.value);
          }}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream-linen text-text-primary font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-wine-accent/40 shadow-inner"
        />
      </div>
      <span className="font-label-sm text-label-sm text-text-muted">
        Harmonized with seasonal bloom calendars
      </span>
    </div>
  );
}

/** Core event details that are sent to the planning API. */
export function WizardEventDetailsFields({
  title,
  notes,
  date,
  onTitleChange,
  onNotesChange,
  onDateChange,
}: WizardEventDetailsFieldsProps): ReactElement {
  return (
    <>
      <TitleInput title={title} onTitleChange={onTitleChange} />
      <DateInput date={date} onDateChange={onDateChange} />
      <WizardNotesInput notes={notes} onNotesChange={onNotesChange} />
    </>
  );
}
