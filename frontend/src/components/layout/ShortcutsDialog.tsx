import { Keyboard } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { Button } from "../ui/Button";

interface ShortcutEntry {
  readonly keyCombo: string;
  readonly description: string;
}

const SHORTCUTS: readonly ShortcutEntry[] = [
  { keyCombo: "Tab / Shift + Tab", description: "Navigate forward / backward between controls" },
  {
    keyCombo: "Enter / Space",
    description: "Activate buttons, toggle switches, select radio cards",
  },
  { keyCombo: "Arrow Keys", description: "Navigate tab panels, select options, adjust sliders" },
  { keyCombo: "Esc", description: "Dismiss active modal dialog or popup overlay" },
  {
    keyCombo: "Double-Esc (≤ 600ms)",
    description: "Close all overlays and return focus to main content",
  },
];

/**
 * Accessible keyboard shortcuts modal dialog explaining standard interactions
 * and double-Escape multi-overlay dismissal (M07-A11).
 *
 * @returns JSX.Element
 */
export function ShortcutsDialog(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-[var(--color-muted)] gap-1.5">
          <Keyboard className="h-4 w-4" aria-hidden="true" />
          <span>Keyboard help</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Keyboard Navigation & Shortcuts"
        description="All interactive features in Occasio are fully operable without a mouse."
      >
        <dl className="divide-y divide-[var(--color-line-subtle)] text-sm">
          {SHORTCUTS.map((s) => (
            <div
              key={s.keyCombo}
              className="py-2.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
            >
              <dt className="font-mono text-xs font-semibold px-2 py-1 rounded-[var(--radius-control)] bg-[var(--color-raised)] text-[var(--color-accent)] w-fit">
                {s.keyCombo}
              </dt>
              <dd className="text-[var(--color-muted)] sm:text-right">{s.description}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
