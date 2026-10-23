import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useUiStore, type EffectsMode } from "../../state/uiStore";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { RadioCardGroup, type RadioCardOption } from "../ui/RadioCardGroup";

const EFFECTS_OPTIONS: readonly RadioCardOption[] = [
  {
    value: "auto",
    label: "Auto",
    description: "Adapts to device hardware capability and prefers-reduced-motion",
    badge: "Default",
  },
  {
    value: "full",
    label: "Full 3D",
    description: "Procedural aurora shaders, confetti particles, and pointer tilt",
  },
  {
    value: "reduced",
    label: "Reduced Motion",
    description: "Capped frame rate, no pointer parallax, static camera",
  },
  {
    value: "off",
    label: "Static Background",
    description: "Disables 3D WebGL canvas entirely; paints layered CSS gradients",
    badge: "WCAG 2.2.2",
  },
];

/**
 * Visual effects control permitting users to throttle or pause 3D animations
 * conforming to WCAG 2.2.2 Pause, Stop, Hide (M07-A8).
 *
 * @returns JSX.Element
 */
export function EffectsToggle(): JSX.Element {
  const [open, setOpen] = useState(false);
  const effectsMode = useUiStore((s) => s.effectsMode);
  const setEffectsMode = useUiStore((s) => s.setEffectsMode);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="text-xs font-mono capitalize gap-1.5"
          aria-label={`Visual effects setting, currently ${effectsMode}`}
        >
          <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
          <span>Effects: {effectsMode}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Visual Effects & Motion Settings"
        description="Customize 3D background rendering, particle density, and motion effects to suit your preferences."
      >
        <RadioCardGroup
          value={effectsMode}
          onValueChange={(val) => {
            setEffectsMode(val as EffectsMode);
          }}
          options={EFFECTS_OPTIONS}
          aria-label="3D Visual Effects Level"
        />
      </DialogContent>
    </Dialog>
  );
}
