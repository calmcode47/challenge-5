import { useState, type ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { useUiStore } from "../../state/uiStore.js";

interface ConceptCardProps {
  scoreBadge: string;
  badgeBg: string;
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
  critic: string;
  onCommit: () => void;
}

function DualPassConceptCard({
  scoreBadge,
  badgeBg,
  icon,
  iconBg,
  title,
  desc,
  critic,
  onCommit,
}: ConceptCardProps): ReactElement {
  return (
    <div className="bg-cream-linen rounded-2xl p-space-md shadow-md flex flex-col gap-space-sm hover:-translate-y-0.5 transition-transform">
      <div className="flex items-center justify-between">
        <span
          className={`font-label-sm text-label-sm ${badgeBg} text-wine-deep px-space-sm py-0.5 rounded-full font-bold`}
        >
          {scoreBadge}
        </span>
        <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-semibold">
          <MaterialIcon name="verified" size={15} />
          <span>Validated</span>
        </span>
      </div>
      <div className="flex items-start gap-space-sm">
        <div
          className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center text-wine-deep shrink-0`}
        >
          <MaterialIcon name={icon} size={24} />
        </div>
        <div>
          <h3 className="font-title-md text-title-md text-text-primary font-bold">{title}</h3>
          <p className="font-body-sm text-body-sm text-text-muted mt-1">{desc}</p>
        </div>
      </div>
      <div className="bg-surface-container-low rounded-xl p-space-xs flex items-center justify-between text-label-sm font-label-sm">
        <span className="text-wine-accent font-medium">{critic}</span>
        <button
          type="button"
          onClick={onCommit}
          className="text-wine-deep font-bold hover:underline flex items-center gap-0.5"
        >
          <span>Commit to Timeline</span>
          <MaterialIcon name="arrow_forward" size={14} />
        </button>
      </div>
    </div>
  );
}

function DualPassPromptBar({
  prompt,
  setPrompt,
  isRunning,
  onRerun,
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  isRunning: boolean;
  onRerun: () => void;
}): ReactElement {
  return (
    <div className="flex items-center justify-between bg-surface-container-lowest/80 backdrop-blur-sm p-space-sm rounded-2xl">
      <div className="flex items-center gap-2 text-wine-deep font-label-md text-label-md flex-1 mr-2">
        <MaterialIcon name="psychology" size={18} />
        <input
          type="text"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          className="w-full bg-transparent outline-none text-wine-deep font-medium text-body-sm"
        />
      </div>
      <button
        type="button"
        disabled={isRunning}
        onClick={onRerun}
        className="px-space-sm py-1 bg-wine-deep text-cream-linen rounded-lg font-label-sm text-label-sm hover:bg-wine-accent transition-colors font-bold disabled:opacity-75 shrink-0"
      >
        {isRunning ? "Evaluating..." : "Rerun Dual-Pass"}
      </button>
    </div>
  );
}

function DualPassHeader(): ReactElement {
  return (
    <div>
      <div className="flex items-center gap-space-xs text-wine-deep mb-1">
        <MaterialIcon name="auto_awesome" size={20} />
        <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest">
          Dual-Pass Intelligence
        </span>
      </div>
      <h2 className="font-headline-md text-headline-md text-wine-deep font-bold">
        Studio Picks: Celebration Concepts
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
        Gemini Generator-Critic validated proposals balanced against sensory flow and low-stress
        guest transitions.
      </p>
    </div>
  );
}

function DualPassCardsList({ onCommit }: { onCommit: (title: string) => void }): ReactElement {
  return (
    <>
      <DualPassConceptCard
        scoreBadge="Score 98/100 • Pass"
        badgeBg="bg-butter-sun"
        icon="local_bar"
        iconBg="bg-secondary-container"
        title="Sunset Acoustic Toast with Zero-Proof Herbal Cordials"
        desc="Hand-pressed elderflower, thyme, and mountain honey cordials poured into hand-turned ceramic goblets as the sun meets the orchard line."
        critic="Critic Review: Low queue bottleneck, 100% accessible to non-drinkers"
        onCommit={() => {
          onCommit("Sunset Acoustic Toast");
        }}
      />
      <DualPassConceptCard
        scoreBadge="Score 94/100 • Pass"
        badgeBg="bg-sage-soft"
        icon="casino"
        iconBg="bg-blush-petal/50"
        title="Quiet Pergola with Handcrafted Wooden Lawn Games"
        desc="Custom oversized Kubb, wooden ring-toss, and tactile ceramic dominoes arranged beneath wild wisteria vines for acoustic sanctuary."
        critic="Critic Review: Prevents sensory overload for neurodivergent guests"
        onCommit={() => {
          onCommit("Quiet Pergola");
        }}
      />
    </>
  );
}

/**
 * Dual-Pass Intelligence concept cards validated by Generator-Critic loop.
 */
export function WorkspaceDualPassBlock(): ReactElement {
  const { showNotification } = useUiStore();
  const [prompt, setPrompt] = useState("Add twilight slow dance with sparkler cadence");
  const [isRunning, setIsRunning] = useState(false);

  const handleCommit = (title: string): void => {
    showNotification(`Committed "${title}" to your run-of-show timeline nodes.`, "success");
  };

  const handleRerun = (): void => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      showNotification(
        "Dual-Pass evaluated: 2 fresh concepts synthesized with score > 90.",
        "info"
      );
    }, 1000);
  };

  return (
    <section className="lg:col-span-5 bg-sage-earth/25 rounded-3xl p-space-lg flex flex-col gap-space-md relative overflow-hidden shadow-sm">
      <DualPassHeader />
      <DualPassCardsList onCommit={handleCommit} />
      <DualPassPromptBar
        prompt={prompt}
        setPrompt={setPrompt}
        isRunning={isRunning}
        onRerun={handleRerun}
      />
    </section>
  );
}
