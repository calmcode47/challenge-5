import { useRef, type ReactElement, type RefObject } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { useDialogAccessibility } from "../../components/common/useDialogAccessibility.js";

/** Props for WorkspaceTimelineModal. */
export interface WorkspaceTimelineModalProps {
  readonly isOpen: boolean;
  readonly planTitle: string;
  readonly onClose: () => void;
}

interface MilestoneItem {
  time: string;
  title: string;
  cue: string;
}

function TimelineDialogHeader({
  planTitle,
  closeButtonRef,
  onClose,
}: {
  planTitle: string;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}): ReactElement {
  return (
    <div className="flex items-center justify-between border-b border-wine-accent/10 pb-space-xs">
      <div className="flex items-center gap-space-xs text-wine-accent">
        <MaterialIcon name="schedule" size={24} />
        <div>
          <h2
            id="timeline-dialog-title"
            className="font-headline-sm text-headline-sm text-wine-deep font-bold"
          >
            Run-of-Show Milestone Schedule
          </h2>
          <span className="font-body-sm text-body-sm text-text-muted">{planTitle}</span>
        </div>
      </div>
      <button
        type="button"
        ref={closeButtonRef}
        onClick={onClose}
        className="w-8 h-8 rounded-full bg-cream-surface flex items-center justify-center text-wine-deep hover:bg-blush-petal/40"
        aria-label="Close schedule"
      >
        <MaterialIcon name="close" size={18} />
      </button>
    </div>
  );
}

const MILESTONES: MilestoneItem[] = [
  {
    time: "14:00",
    title: "Atelier Open & Musician Soundcheck",
    cue: "Acoustic cello tuning, max 78dB",
  },
  {
    time: "15:30",
    title: "Guest Arrival & Elderflower Cordials",
    cue: "Zero-proof bar open at stone barn",
  },
  {
    time: "16:15",
    title: "Ceremony & Handcrafted Vow Exchange",
    cue: "Petal buds aisle procession",
  },
  {
    time: "17:30",
    title: "Golden Hour Studio Portraits",
    cue: "Natural 35mm film session in orchard",
  },
  {
    time: "18:45",
    title: "Communal Banquet Dinner",
    cue: "Gluten-isolated stoneware table course",
  },
  { time: "20:30", title: "Acoustic Folk Slow Dance", cue: "Subtle candlelit illumination" },
];

function MilestoneList(): ReactElement {
  return (
    <div className="flex flex-col gap-space-sm divide-y divide-wine-accent/10">
      {MILESTONES.map((m) => (
        <div key={m.time} className="pt-space-xs first:pt-0 flex items-start gap-space-md">
          <span className="font-label-lg text-label-lg font-bold text-wine-accent w-16 shrink-0 mt-0.5">
            {m.time}
          </span>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-wine-deep font-bold">{m.title}</span>
            <span className="font-body-sm text-body-sm text-text-muted">{m.cue}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Modal displaying chronological Run-of-Show event nodes and sensory cues.
 */
export function WorkspaceTimelineModal({
  isOpen,
  planTitle,
  onClose,
}: WorkspaceTimelineModalProps): ReactElement | null {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useDialogAccessibility(isOpen, onClose, dialogRef, closeButtonRef);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-wine-deep/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeline-dialog-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className="w-full max-w-xl bg-cream-linen rounded-3xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-wine-accent/15 max-h-[85vh] overflow-y-auto">
        <TimelineDialogHeader
          planTitle={planTitle}
          closeButtonRef={closeButtonRef}
          onClose={onClose}
        />

        <MilestoneList />

        <div className="flex justify-end gap-space-sm pt-space-xs">
          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            className="px-space-md py-space-xs rounded-xl bg-cream-surface text-wine-deep font-label-md text-label-md font-bold hover:bg-blush-petal/30 flex items-center gap-1 shadow-xs"
          >
            <MaterialIcon name="print" size={16} />
            <span>Print Run-of-Show</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-space-md py-space-xs rounded-xl bg-wine-accent text-cream-linen font-label-md text-label-md font-bold hover:bg-wine-deep shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
