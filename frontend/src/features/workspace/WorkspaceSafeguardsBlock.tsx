import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { useUiStore } from "../../state/uiStore.js";

interface InquiryItem {
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
  vendor: string;
  auditRef: string;
  badge: string;
  buttonLabel: string;
}

const INQUIRIES: InquiryItem[] = [
  {
    icon: "restaurant",
    iconBg: "bg-blush-petal/30",
    title: "Kitchen Allergen Segregation Protocol",
    desc: "Dedicated non-gluten & sesame prep station on stoneware prep counters. 14 flagged attendee cards verified.",
    vendor: "Orchard Wild Table",
    auditRef: "#CLAY-KITCHEN-08",
    badge: "Compliant",
    buttonLabel: "View Signoff",
  },
  {
    icon: "volume_down",
    iconBg: "bg-butter-sun/30",
    title: "Township Sound & Decibel Enclosure Limits",
    desc: "Strict max 82dB acoustic folk limit at property perimeter after 21:30. Directional speakers oriented toward the stone barn.",
    vendor: "Pine Hollow Sound & Brass",
    auditRef: "#TWP-2025-41A",
    badge: "Approved",
    buttonLabel: "Acoustic Map",
  },
  {
    icon: "accessible",
    iconBg: "bg-secondary-fixed",
    title: "Barrier-Free Ceramic Courtyard Access (ADA)",
    desc: "Packed decomposed granite walkways from parking arbor to dinner pergola with handrail grading below 1:12 slope.",
    vendor: "Heritage Orchard Grounds",
    auditRef: "Slope Clearance: 1:14 Verified",
    badge: "Inspected",
    buttonLabel: "Grounds Route",
  },
];

function SafeguardCard({
  item,
  onSignoff,
}: {
  item: InquiryItem;
  onSignoff: (ref: string) => void;
}): ReactElement {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
      <div className="flex items-start gap-space-sm">
        <div
          className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center text-wine-accent shrink-0 mt-0.5`}
        >
          <MaterialIcon name={item.icon} size={20} />
        </div>
        <div>
          <div className="flex items-center gap-space-xs">
            <h3 className="font-title-md text-title-md text-text-primary font-bold">
              {item.title}
            </h3>
            <MaterialIcon name="check_circle" size={18} className="text-secondary" />
          </div>
          <p className="font-body-sm text-body-sm text-text-muted mt-0.5">{item.desc}</p>
          <div className="flex items-center gap-space-sm mt-space-xs text-label-sm font-label-sm text-secondary font-medium">
            <span>Vendor: {item.vendor}</span>
            <span>&bull;</span>
            <span>Audit Ref: {item.auditRef}</span>
          </div>
        </div>
      </div>
      <div className="flex md:flex-col items-end gap-1 shrink-0">
        <span className="px-space-sm py-0.5 rounded-full bg-sage-soft text-secondary font-label-sm text-label-sm font-bold">
          {item.badge}
        </span>
        <button
          type="button"
          onClick={() => {
            onSignoff(item.auditRef);
          }}
          className="text-wine-accent hover:text-wine-deep font-label-sm text-label-sm underline font-semibold"
        >
          {item.buttonLabel}
        </button>
      </div>
    </div>
  );
}

/**
 * Vendor RFP safeguard inquiries and compliance review block.
 */
export function WorkspaceSafeguardsBlock(): ReactElement {
  const { showNotification } = useUiStore();

  const handleSignoff = (ref: string): void => {
    showNotification(`Signoff docket ${ref} verified and stored.`, "info");
  };

  const handleDispatch = (): void => {
    showNotification("New RFP dispatch created. Vendor questions added to checklist.", "success");
  };

  return (
    <section className="lg:col-span-7 bg-cream-linen rounded-3xl p-space-lg flex flex-col gap-space-md shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div>
          <div className="flex items-center gap-space-xs text-wine-accent mb-0.5">
            <MaterialIcon name="shield_with_heart" size={18} />
            <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
              Operational Integrity
            </span>
          </div>
          <h2 className="font-headline-md text-headline-md text-text-primary font-bold">
            Vendor RFP Safeguard Inquiries
          </h2>
        </div>
        <span className="bg-sage-soft text-wine-deep font-label-sm text-label-sm px-space-sm py-1 rounded-full font-bold">
          3 of 3 Active Audits Passed
        </span>
      </div>

      <div className="flex flex-col gap-space-sm">
        {INQUIRIES.map((item) => (
          <SafeguardCard key={item.title} item={item} onSignoff={handleSignoff} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
        <span className="font-body-sm text-body-sm text-text-muted">
          Need additional vendor certification?
        </span>
        <button
          type="button"
          onClick={handleDispatch}
          className="flex items-center gap-1.5 px-space-md py-space-xs bg-wine-deep text-cream-linen rounded-xl font-label-md text-label-md hover:bg-wine-accent transition-all shadow-sm font-bold"
        >
          <MaterialIcon name="send" size={16} />
          <span>Dispatch New RFP Inquiry</span>
        </button>
      </div>
    </section>
  );
}
