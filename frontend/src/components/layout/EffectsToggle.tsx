import { Pause, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import type { EffectsMode } from "../../state/uiStore";
import { useEffects } from "../../three/EffectsProvider";
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
 * Visual effects control permitting users to throttle, configure, or pause 3D animations
 * conforming to WCAG 2.2.2 Pause, Stop, Hide (M07-A8).
 *
 * @returns JSX.Element
 */
export function EffectsToggle(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { quality, userMode, setUserMode, paused, setPaused } = useEffects();

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setPaused((p) => !p);
        }}
        className="text-xs font-mono gap-1 px-2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
        aria-label={paused ? "Resume background animation" : "Pause background animation"}
        title={paused ? "Resume background animation" : "Pause background animation"}
        disabled={quality === "static"}
      >
        {paused ? (
          <Play className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
        ) : (
          <Pause className="h-3.5 w-3.5 text-[var(--color-muted)]" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{paused ? "Resume" : "Pause"}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="text-xs font-mono capitalize gap-1.5"
            aria-label={`Visual effects setting, currently ${userMode}`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
            <span>Effects: {userMode}</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          title="Visual Effects & Motion Settings"
          description="Customize 3D background rendering, particle density, and motion effects to suit your preferences."
        >
          <RadioCardGroup
            value={userMode}
            onValueChange={(val) => {
              setUserMode(val as EffectsMode);
            }}
            options={EFFECTS_OPTIONS}
            aria-label="3D Visual Effects Level"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
