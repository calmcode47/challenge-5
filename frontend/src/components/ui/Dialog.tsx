import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Dialog as RadixDialog } from "radix-ui";
import { IconButton } from "./IconButton";

/**
 * Root container for accessible modal dialogs wrapping Radix Dialog.
 */
export const Dialog = RadixDialog.Root;

/**
 * Trigger element opening the modal dialog.
 */
export const DialogTrigger = RadixDialog.Trigger;

/**
 * Accessible title element required for screen reader context.
 */
export const DialogTitle = RadixDialog.Title;

/**
 * Optional explanatory description element for dialog context.
 */
export const DialogDescription = RadixDialog.Description;

/**
 * Button or element triggering dialog dismissal.
 */
export const DialogClose = RadixDialog.Close;

/**
 * Props for the DialogContent modal body.
 */
export interface DialogContentProps {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Modal dialog content box rendered inside an accessible portal with backdrop overlay
 * and automatic focus-trapping.
 *
 * @param props - DialogContentProps
 * @returns JSX.Element
 */
export function DialogContent({
  title,
  description,
  children,
  className = "",
}: DialogContentProps): JSX.Element {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity duration-200" />
      <RadixDialog.Content
        className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] p-6 shadow-2xl focus:outline-none ${className}`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <RadixDialog.Title className="text-xl font-semibold text-[var(--color-text)]">
              {title}
            </RadixDialog.Title>
            {description && (
              <RadixDialog.Description className="text-sm text-[var(--color-muted)] mt-1">
                {description}
              </RadixDialog.Description>
            )}
          </div>
          <RadixDialog.Close asChild>
            <IconButton label="Close dialog" icon={<X className="h-5 w-5" />} />
          </RadixDialog.Close>
        </div>
        <div>{children}</div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
