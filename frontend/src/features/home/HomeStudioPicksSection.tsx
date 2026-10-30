import { useState, type ReactElement } from "react";
import { Link } from "react-router";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";

type TabId = "timeline" | "budget" | "seating";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

function StudioPicksIntro({ activeTab, onTabChange }: SidebarProps): ReactElement {
  return (
    <div className="lg:col-span-4 flex flex-col">
      <div className="w-12 h-12 rounded-full bg-cream-linen text-secondary flex items-center justify-center mb-space-sm shadow-sm">
        <MaterialIcon name="draw" size={26} />
      </div>
      <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-widest font-bold">
        Planning Workspace Preview
      </span>
      <h2 className="font-headline-lg text-headline-lg text-cream-linen mt-1 leading-tight font-bold">
        Explore Practical Planning Views
      </h2>
      <p className="font-body-md text-body-md text-cream-surface/90 mt-space-sm mb-space-lg">
        Illustrative previews of the timeline, budget, and guest-care views available in the
        workspace. Values shown here are examples, not live event telemetry.
      </p>

      <div
        className="bg-wine-deep/30 p-space-xs rounded-xl flex items-center gap-space-xs self-start"
        role="tablist"
        aria-label="Planner tools"
      >
        {(["timeline", "budget", "seating"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => {
              onTabChange(tab);
            }}
            className={`px-space-md py-space-xs rounded-lg font-label-sm text-label-sm capitalize transition-all ${
              activeTab === tab
                ? "bg-cream-linen text-wine-deep font-bold shadow-xs"
                : "text-cream-linen hover:bg-cream-linen/10"
            }`}
          >
            {tab === "timeline"
              ? "Flow Timeline"
              : tab === "budget"
                ? "Slip Ledger"
                : "Wheel Seating"}
          </button>
        ))}
      </div>
    </div>
  );
}

function WaveVaseCard(): ReactElement {
  return (
    <Link
      to="/event-workspace"
      className="bg-cream-surface text-wine-deep rounded-[2rem] p-space-md flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform text-left"
    >
      <div className="w-full bg-surface-container-high rounded-t-[3.5rem] rounded-b-xl p-space-sm flex flex-col items-center justify-center h-44 relative">
        <svg className="w-full h-full text-wine-accent" viewBox="0 0 160 100" aria-hidden="true">
          <path
            d="M10,80 C40,10 60,90 90,20 C110,60 130,30 150,50"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="35" cy="46" fill="#F3CE72" r="6" />
          <circle cx="90" cy="20" fill="#7A2832" r="7" />
          <circle cx="150" cy="50" fill="#98A886" r="6" />
        </svg>
        <div className="absolute bottom-2 px-space-xs py-0.5 bg-cream-linen text-wine-deep font-label-sm text-label-sm rounded-full font-bold">
          Example schedule view
        </div>
      </div>
      <div className="mt-space-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-wine-deep font-bold">Wave Vase</h3>
          <MaterialIcon name="waves" size={20} className="text-secondary" />
        </div>
        <p className="font-body-sm text-body-sm text-text-muted mt-1">
          Flowing milestone schedule with organic pauses between vows, toasts, and evening jazz.
        </p>
        <div className="mt-space-sm flex items-center gap-space-xs text-secondary font-label-sm text-label-sm font-bold">
          <span>Adaptive Velocity</span>
          <MaterialIcon name="arrow_forward" size={16} />
        </div>
      </div>
    </Link>
  );
}

function BloomLampCard(): ReactElement {
  return (
    <Link
      to="/event-workspace"
      className="bg-cream-surface text-wine-deep rounded-[2rem] p-space-md flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform text-left"
    >
      <div className="w-full bg-butter-sun/40 rounded-t-[3.5rem] rounded-b-xl p-space-sm flex flex-col items-center justify-center h-44 relative">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <path
              className="text-cream-linen"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="text-wine-accent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="72, 100"
              strokeLinecap="round"
              strokeWidth="3.5"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">72%</span>
            <span className="font-label-sm text-label-sm text-secondary font-medium">
              Allocated
            </span>
          </div>
        </div>
        <div className="absolute bottom-2 px-space-xs py-0.5 bg-cream-linen text-wine-deep font-label-sm text-label-sm rounded-full font-bold">
          Example contingency view
        </div>
      </div>
      <div className="mt-space-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-wine-deep font-bold">Bloom Lamp</h3>
          <MaterialIcon name="lightbulb" size={20} className="text-butter-sun" filled />
        </div>
        <p className="font-body-sm text-body-sm text-text-muted mt-1">
          A warm glow over finances. Integer minor-units with locked contingency buffers for
          florals.
        </p>
        <div className="mt-space-sm flex items-center gap-space-xs text-secondary font-label-sm text-label-sm font-bold">
          <span>View Ledger</span>
          <MaterialIcon name="arrow_forward" size={16} />
        </div>
      </div>
    </Link>
  );
}

function ColorTrayCard(): ReactElement {
  return (
    <Link
      to="/event-workspace"
      className="bg-cream-surface text-wine-deep rounded-[2rem] p-space-md flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform text-left"
    >
      <div className="w-full bg-blush-petal/50 rounded-t-[3.5rem] rounded-b-xl p-space-sm flex flex-col items-center justify-center h-44 relative">
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="w-10 h-10 rounded-full bg-wine-accent shadow-xs flex items-center justify-center text-cream-linen text-[11px] font-bold">
            Vow
          </div>
          <div className="w-10 h-10 rounded-full bg-butter-sun shadow-xs flex items-center justify-center text-wine-deep text-[11px] font-bold">
            Kin
          </div>
          <div className="w-10 h-10 rounded-full bg-sage-earth shadow-xs flex items-center justify-center text-cream-linen text-[11px] font-bold">
            Chef
          </div>
          <div className="w-10 h-10 rounded-full bg-blush-deep shadow-xs flex items-center justify-center text-wine-deep text-[11px] font-bold">
            Band
          </div>
        </div>
        <div className="absolute bottom-2 px-space-xs py-0.5 bg-cream-linen text-wine-deep font-label-sm text-label-sm rounded-full font-bold">
          Sensory Zones
        </div>
      </div>
      <div className="mt-space-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-wine-deep font-bold">Color Tray</h3>
          <MaterialIcon name="palette" size={20} className="text-blush-deep" />
        </div>
        <p className="font-body-sm text-body-sm text-text-muted mt-1">
          Seating pottery wheel balancing dietary restrictions, acoustic proximity, and friend
          clusters.
        </p>
        <div className="mt-space-sm flex items-center gap-space-xs text-secondary font-label-sm text-label-sm font-bold">
          <span>Spin Seating</span>
          <MaterialIcon name="arrow_forward" size={16} />
        </div>
      </div>
    </Link>
  );
}

/**
 * Green sage block linking to illustrative workspace previews.
 */
export function HomeStudioPicksSection(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>("timeline");

  return (
    <section className="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter py-space-lg">
      <div className="w-full bg-sage-earth text-cream-linen rounded-[2.5rem] p-space-lg md:p-space-2xl shadow-[0_12px_32px_rgba(84,99,70,0.22)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <StudioPicksIntro activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <WaveVaseCard />
            <BloomLampCard />
            <ColorTrayCard />
          </div>
        </div>
      </div>
    </section>
  );
}
