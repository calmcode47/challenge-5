import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { DaisySvg } from "../../components/common/DaisySvg.js";

interface StageInfo {
  num: string;
  stage: string;
  title: string;
  active: boolean;
}

const STAGES: StageInfo[] = [
  { num: "01", stage: "Stage One", title: "Event Essence", active: true },
  { num: "02", stage: "Stage Two", title: "Coordinates", active: false },
  { num: "03", stage: "Stage Three", title: "Deterministic Budget", active: false },
  { num: "04", stage: "Stage Four", title: "Sensory Matrix", active: false },
];

function StageBadges(): ReactElement {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm w-full max-w-4xl mt-space-xl">
      {STAGES.map((s) => (
        <div
          key={s.num}
          className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-2xl ${
            s.active
              ? "bg-wine-accent/90 text-cream-linen shadow-md"
              : "bg-wine-accent/40 text-cream-linen/80"
          }`}
        >
          <span
            className={`w-7 h-7 rounded-full font-label-sm text-label-sm flex items-center justify-center font-bold ${
              s.active ? "bg-butter-sun text-text-primary" : "bg-cream-linen/20 text-cream-linen"
            }`}
          >
            {s.num}
          </span>
          <div className="flex flex-col text-left">
            <span
              className={`font-label-sm text-label-sm uppercase tracking-wider font-semibold ${s.active ? "text-butter-sun" : "text-blush-petal/80"}`}
            >
              {s.stage}
            </span>
            <span
              className={`font-label-lg text-label-lg font-bold ${s.active ? "text-cream-linen" : "text-cream-linen/90"}`}
            >
              {s.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Ceramic Studio Header Banner with scalloped base, daisy motifs, and 4-stage stepper badges.
 */
export function WizardStepperHeader(): ReactElement {
  return (
    <section className="relative bg-wine-deep text-cream-linen px-gutter pt-space-xl pb-space-2xl rounded-b-[2.5rem] shadow-xl overflow-hidden">
      <div className="absolute -top-6 -left-6 w-28 h-28 opacity-25 pointer-events-none text-butter-sun">
        <DaisySvg size={90} petalColor="#F3CE72" centerColor="#FBF7EE" />
      </div>
      <div className="absolute top-4 right-10 w-20 h-20 opacity-30 pointer-events-none text-blush-petal">
        <DaisySvg size={70} petalColor="#F2BEB9" centerColor="#F3CE72" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-wine-accent/70 text-butter-sun font-label-sm text-label-sm tracking-wider uppercase mb-space-sm shadow-sm font-semibold">
          <MaterialIcon name="draw" size={16} />
          <span>Tactile Celebration Intake Studio</span>
        </div>
        <h1
          tabIndex={-1}
          className="font-headline-xl text-headline-xl text-cream-linen max-w-3xl font-bold tracking-tight"
        >
          Handcraft Your Milestone
        </h1>
        <p className="font-body-lg text-body-lg text-blush-petal max-w-2xl mt-space-xs font-normal">
          Sculpting gatherings with deterministic budgets, sensory ease, and the gentle touch of
          stoneware craft.
        </p>
        <StageBadges />
      </div>

      <div className="absolute -bottom-1 left-0 right-0 h-6 overflow-hidden pointer-events-none text-surface">
        <svg
          className="w-full h-full fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 1200 24"
          aria-hidden="true"
        >
          <path d="M0,0 C50,24 100,24 150,0 C200,24 250,24 300,0 C350,24 400,24 450,0 C500,24 550,24 600,0 C650,24 700,24 750,0 C800,24 850,24 900,0 C950,24 1000,24 1050,0 C1100,24 1150,24 1200,0 L1200,24 L0,24 Z" />
        </svg>
      </div>
    </section>
  );
}
