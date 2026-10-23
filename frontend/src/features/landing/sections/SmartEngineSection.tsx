import {
  buildBaselinePlan,
  type BudgetLine,
  type Milestone,
  type Plan,
  type PlanInput,
} from "@occasio/shared";
import { useMemo } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { Stat } from "../../../components/ui/Stat";
import { formatDate, formatMoney } from "../../../lib/format";
import { LANDING_COPY } from "../copy";

/**
 * Fixed reference timestamp used for deterministic sample engine execution.
 */
export const SAMPLE_ENGINE_NOW = new Date("2026-10-24T00:00:00.000Z");

/**
 * Validated sample event input matching prompt requirements:
 * Wedding, 120 guests, 240 days out, $40,000.00 USD total budget.
 */
export const SAMPLE_ENGINE_INPUT: PlanInput = {
  eventType: "wedding",
  title: "Sample Wedding Celebration",
  eventDate: new Date(SAMPLE_ENGINE_NOW.getTime() + 240 * 86400000).toISOString().slice(0, 10),
  guestCount: 120,
  budget: {
    currency: "USD",
    totalMinor: 4000000,
  },
  venueType: "banquet_hall",
  dietary: [],
  accessibilityNeeds: [],
  priorities: {},
};

const CATEGORY_COLORS: Record<string, string> = {
  catering: "var(--color-accent)",
  venue: "var(--color-violet)",
  decor: "var(--color-teal)",
  photo_video: "var(--color-coral)",
  entertainment: "#E879F9",
  attire_beauty: "#F472B6",
  contingency: "#94A3B8",
};

function BudgetSvgDistribution({ lines }: { readonly lines: readonly BudgetLine[] }): JSX.Element {
  let accumulatedX = 0;
  return (
    <div className="w-full h-5 rounded-md overflow-hidden bg-[var(--color-raised)] border border-[var(--color-line-subtle)]">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        role="img"
        aria-label="Proportional budget breakdown bar chart"
      >
        {lines.map((line) => {
          const width = line.sharePct;
          const x = accumulatedX;
          accumulatedX += width;
          const color = CATEGORY_COLORS[line.categoryId] ?? "var(--color-muted)";
          return <rect key={line.categoryId} x={x} y={0} width={width} height={20} fill={color} />;
        })}
      </svg>
    </div>
  );
}

function BudgetTopLines({ lines }: { readonly lines: readonly BudgetLine[] }): JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
      {lines.map((line) => (
        <div
          key={line.categoryId}
          className="flex items-center justify-between p-2 rounded bg-[var(--color-raised)] text-xs border border-[var(--color-line-subtle)] font-mono"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: CATEGORY_COLORS[line.categoryId] ?? "var(--color-muted)",
              }}
              aria-hidden="true"
            />
            <span className="capitalize truncate text-[var(--color-text)]">
              {line.categoryId.replace("_", " ")}
            </span>
          </div>
          <span className="text-[var(--color-muted)] font-medium shrink-0 ml-1">
            {line.sharePct.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function MilestonesSummary({
  milestones,
}: {
  readonly milestones: readonly Milestone[];
}): JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {milestones.map((m) => (
        <div
          key={m.id}
          className="p-3 rounded-lg bg-[var(--color-raised)] border border-[var(--color-line-subtle)] space-y-1"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[var(--color-accent)] font-semibold">
              {String(m.leadDays)} days prior
            </span>
            <span className="text-[11px] font-mono text-[var(--color-muted)]">
              {formatDate(m.dueDate)}
            </span>
          </div>
          <p className="text-xs font-medium text-[var(--color-text)] truncate">{m.title}</p>
        </div>
      ))}
    </div>
  );
}

function LiveEngineHeader({
  liveDemoTitle,
  liveDemoDescription,
  totalMinor,
  currency,
}: {
  readonly liveDemoTitle: string;
  readonly liveDemoDescription: string;
  readonly totalMinor: number;
  readonly currency: string;
}): JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--color-line-subtle)]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wide text-[var(--color-text)]">
            {liveDemoTitle}
          </h3>
          <Badge kind="calculated">Calculated</Badge>
          <Badge kind="demo">Sample</Badge>
        </div>
        <p className="text-xs sm:text-sm text-[var(--color-muted)]">{liveDemoDescription}</p>
      </div>
      <div className="text-right">
        <span className="text-xs font-mono uppercase text-[var(--color-muted)]">Total Plan</span>
        <p className="text-xl font-mono font-bold text-[var(--color-accent)] tabular-nums">
          {formatMoney(totalMinor, currency)}
        </p>
      </div>
    </div>
  );
}

function StatsGrid({
  stats,
}: {
  readonly stats: typeof LANDING_COPY.smartEngine.stats;
}): JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Stat
          key={stat.label}
          label={stat.label}
          value={stat.value}
          helper={stat.helper}
          badge={<Badge kind="calculated">Guaranteed</Badge>}
        />
      ))}
    </div>
  );
}

/**
 * Smart by Design section highlighting the deterministic-core + AI split,
 * 3 core guarantee statistics, and a live runtime execution of buildBaselinePlan.
 *
 * @returns JSX.Element
 */
export function SmartEngineSection(): JSX.Element {
  const copy = LANDING_COPY.smartEngine;
  const samplePlan: Plan = useMemo(() => {
    return buildBaselinePlan(SAMPLE_ENGINE_INPUT, SAMPLE_ENGINE_NOW);
  }, []);

  return (
    <section
      id="smart-engine"
      aria-labelledby="smart-engine-heading"
      className="py-16 sm:py-24 space-y-12"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 800px" }}
    >
      <div className="max-w-3xl space-y-4">
        <h2
          id="smart-engine-heading"
          className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-wide text-[var(--color-text)]"
        >
          {copy.sectionTitle}
        </h2>
        <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
          {copy.sectionSubtitle}
        </p>
      </div>

      <StatsGrid stats={copy.stats} />

      <Card
        data-testid="live-engine-card"
        className="p-6 sm:p-8 bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-line)] shadow-xl space-y-6"
      >
        <LiveEngineHeader
          liveDemoTitle={copy.liveDemoTitle}
          liveDemoDescription={copy.liveDemoDescription}
          totalMinor={samplePlan.budget.totalMinor}
          currency={samplePlan.budget.currency}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[var(--color-muted)]">
            <span>Deterministic Budget Allocation (SVG Distribution)</span>
            <span>100% accounted for</span>
          </div>
          <BudgetSvgDistribution lines={samplePlan.budget.lines} />
          <BudgetTopLines lines={samplePlan.budget.lines.slice(0, 6)} />
        </div>

        <div className="space-y-3 pt-4 border-t border-[var(--color-line-subtle)]">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[var(--color-muted)]">
            <span>Back-Scheduled Milestones (Lead Days from Event)</span>
            <span>{samplePlan.timeline.milestones.length} total scheduled</span>
          </div>
          <MilestonesSummary milestones={samplePlan.timeline.milestones.slice(0, 3)} />
        </div>
      </Card>
    </section>
  );
}
