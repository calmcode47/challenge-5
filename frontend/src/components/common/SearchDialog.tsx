import { useState, type ReactElement } from "react";
import { Link } from "react-router";
import { MaterialIcon } from "./MaterialIcon.js";
import { useUiStore } from "../../state/uiStore.js";
import { loadPlans, type StoredPlan } from "../../state/persistence.js";

function SearchResultsList({
  plans,
  onClose,
}: {
  plans: StoredPlan[];
  onClose: () => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-space-xs max-h-64 overflow-y-auto">
      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
        Celebrations ({String(plans.length)})
      </span>
      {plans.map((plan) => (
        <Link
          key={plan.id}
          to={`/event-workspace?planId=${plan.id}`}
          onClick={onClose}
          className="p-space-sm rounded-xl hover:bg-cream-surface flex items-center justify-between text-left transition-colors"
        >
          <div>
            <span className="font-title-md text-title-md text-wine-deep block font-bold">
              {plan.title}
            </span>
            <span className="font-body-sm text-body-sm text-text-muted">
              {plan.venue} &middot; {String(plan.guestCount)} guests
            </span>
          </div>
          <MaterialIcon name="arrow_forward" size={18} className="text-secondary" />
        </Link>
      ))}
      {plans.length === 0 && (
        <span className="font-body-sm text-body-sm text-text-muted py-2 text-center">
          No matching celebrations found.
        </span>
      )}
    </div>
  );
}

/**
 * Accessible search modal dialog allowing navigation across celebrations and tools.
 */
export function SearchDialog(): ReactElement | null {
  const { isSearchOpen, closeSearch } = useUiStore();
  const [query, setQuery] = useState("");
  const plans = loadPlans();

  if (!isSearchOpen) return null;

  const filteredPlans = plans.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.venue.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-wine-deep/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search studio vault and tools"
    >
      <div className="w-full max-w-xl bg-cream-linen rounded-3xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-wine-accent/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-wine-accent">
            <MaterialIcon name="search" size={24} />
            <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
              Studio Search
            </span>
          </div>
          <button
            type="button"
            onClick={closeSearch}
            className="w-8 h-8 rounded-full bg-cream-surface flex items-center justify-center text-wine-deep hover:bg-blush-petal/40 transition-colors"
            aria-label="Close search"
          >
            <MaterialIcon name="close" size={18} />
          </button>
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search celebrations, blueprints, tableware..."
          className="w-full px-space-md py-space-sm rounded-xl bg-cream-surface text-wine-deep font-body-md text-body-md shadow-inner outline-none focus:ring-2 focus:ring-wine-accent/30"
        />

        <SearchResultsList plans={filteredPlans} onClose={closeSearch} />
      </div>
    </div>
  );
}
