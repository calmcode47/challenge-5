import { useRef, type ReactElement, type RefObject } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { useDialogAccessibility } from "../../components/common/useDialogAccessibility.js";
import type { TimelineTask } from "../../state/persistence.js";

/** Props for WorkspaceTimelineModal. */
export interface WorkspaceTimelineModalProps {
  readonly isOpen: boolean;
  readonly planTitle: string;
  readonly timeline?: readonly TimelineTask[];
  readonly onClose: () => void;
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

function MilestoneList({ timeline }: { timeline?: readonly TimelineTask[] }): ReactElement {
  if (!timeline?.length) {
    return (
      <p className="font-body-sm text-body-sm text-text-muted">
        Create a plan to generate dated milestones.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-space-sm divide-y divide-wine-accent/10">
      {timeline.map((milestone) => (
        <div
          key={`${milestone.phase}-${milestone.due}`}
          className="pt-space-xs first:pt-0 flex items-start gap-space-md"
        >
          <span className="font-label-lg text-label-lg font-bold text-wine-accent w-16 shrink-0 mt-0.5">
            {milestone.due}
          </span>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-wine-deep font-bold">
              {milestone.phase}
            </span>
            <span className="font-body-sm text-body-sm text-text-muted">
              {milestone.task} Owner: {milestone.owner}.
            </span>
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
  timeline,
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

        <MilestoneList timeline={timeline} />

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
