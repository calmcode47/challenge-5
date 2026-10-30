import type { ReactElement } from "react";
import { Link } from "react-router";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";

interface ConceptCardProps {
  label: string;
  badgeBg: string;
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
  planningNote: string;
}

function DualPassConceptCard({
  label,
  badgeBg,
  icon,
  iconBg,
  title,
  desc,
  planningNote,
}: ConceptCardProps): ReactElement {
  return (
    <div className="bg-cream-linen rounded-2xl p-space-md shadow-md flex flex-col gap-space-sm hover:-translate-y-0.5 transition-transform">
      <div className="flex items-center justify-between">
        <span
          className={`font-label-sm text-label-sm ${badgeBg} text-wine-deep px-space-sm py-0.5 rounded-full font-bold`}
        >
          {label}
        </span>
        <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-semibold">
          <MaterialIcon name="verified" size={15} />
          <span>Illustrative</span>
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
        <span className="text-wine-accent font-medium">{planningNote}</span>
        <Link
          to="/plan-wizard"
          className="text-wine-deep font-bold hover:underline flex items-center gap-0.5"
        >
          <span>Refine in wizard</span>
          <MaterialIcon name="arrow_forward" size={14} />
        </Link>
      </div>
    </div>
  );
}

function DualPassHeader(): ReactElement {
  return (
    <div>
      <div className="flex items-center gap-space-xs text-wine-deep mb-1">
        <MaterialIcon name="auto_awesome" size={20} />
        <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest">
          Planning considerations
        </span>
      </div>
      <h2 className="font-headline-md text-headline-md text-wine-deep font-bold">
        Illustrative Celebration Ideas
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
        Examples show how the planner can translate guest comfort and schedule flow into useful
        priorities. Create a plan for context-specific recommendations.
      </p>
    </div>
  );
}

function DualPassCardsList(): ReactElement {
  return (
    <>
      <DualPassConceptCard
        label="Guest-care example"
        badgeBg="bg-butter-sun"
        icon="local_bar"
        iconBg="bg-secondary-container"
        title="Sunset Acoustic Toast with Zero-Proof Herbal Cordials"
        desc="Hand-pressed elderflower, thyme, and mountain honey cordials poured into hand-turned ceramic goblets as the sun meets the orchard line."
        planningNote="Consider queues, non-alcoholic choices, and quiet pacing."
      />
      <DualPassConceptCard
        label="Low-sensory example"
        badgeBg="bg-sage-soft"
        icon="casino"
        iconBg="bg-blush-petal/50"
        title="Quiet Pergola with Handcrafted Wooden Lawn Games"
        desc="Custom oversized Kubb, wooden ring-toss, and tactile ceramic dominoes arranged beneath wild wisteria vines for acoustic sanctuary."
        planningNote="Confirm supervision, acoustic limits, and accessible routes."
      />
    </>
  );
}

/**
 * Context-setting examples that direct guests to the real plan-creation flow.
 */
export function WorkspaceDualPassBlock(): ReactElement {
  return (
    <section className="lg:col-span-5 bg-sage-earth/25 rounded-3xl p-space-lg flex flex-col gap-space-md relative overflow-hidden shadow-sm">
      <DualPassHeader />
      <DualPassCardsList />
    </section>
  );
}
