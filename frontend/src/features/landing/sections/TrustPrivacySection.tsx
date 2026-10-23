import { ShieldCheck, Database, DownloadCloud, Eye } from "lucide-react";
import { Link } from "react-router";
import { Card } from "../../../components/ui/Card";
import { LANDING_COPY } from "../copy";

const pillarIcons = [
  <ShieldCheck key="shield" className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />,
  <Database key="db" className="w-5 h-5 text-[var(--color-teal)]" aria-hidden="true" />,
  <DownloadCloud
    key="download"
    className="w-5 h-5 text-[var(--color-accent)]"
    aria-hidden="true"
  />,
  <Eye key="eye" className="w-5 h-5 text-[var(--color-violet)]" aria-hidden="true" />,
];

/**
 * Trust & Privacy section detailing data sovereignty, local-first persistence,
 * and transparent AI provenance guarantees with direct link to full privacy policy.
 *
 * @returns JSX.Element
 */
export function TrustPrivacySection(): JSX.Element {
  const copy = LANDING_COPY.trustPrivacy;

  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="py-16 sm:py-24 space-y-12"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}
    >
      <div className="max-w-3xl space-y-4">
        <h2
          id="trust-heading"
          className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-wide text-[var(--color-text)]"
        >
          {copy.sectionTitle}
        </h2>
        <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
          {copy.sectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {copy.pillars.map((pillar, idx) => (
          <Card
            key={pillar.title}
            className="p-6 bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-line-subtle)] space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-[var(--color-raised)] border border-[var(--color-line-subtle)]">
                {pillarIcons[idx]}
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">{pillar.title}</h3>
            </div>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              {pillar.description}
            </p>
          </Card>
        ))}
      </div>

      <div className="pt-2 text-center sm:text-left">
        <Link
          to="/privacy"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
        >
          <span>{copy.linkText}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
