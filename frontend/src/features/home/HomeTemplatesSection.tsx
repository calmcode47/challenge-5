import type { ReactElement } from "react";
import { Link } from "react-router";
import { DaisySvg } from "../../components/common/DaisySvg.js";
import { WavyDivider } from "../../components/common/WavyDivider.js";

interface TemplateItem {
  title: string;
  category: string;
  bgClass: string;
  imgUrl: string;
  desc: string;
  flow: string;
  price: string;
  vertical: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    title: "Petal Wedding",
    category: "Ceremony",
    bgClass: "bg-blush-petal/40",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEdqk7e0RG-lM7XZoH9RM-fg_8bgKvDflmQXFflOrUoT8VbAcBmusMolVeqcgp-NfeBQehsZ5W65hdaNcY6DRhn92Ot9-JHPRF4DRVlCkB8kUs-PMwL05Rpllm2CCKz-IPW9fgatE1qPAfqgLTzMoTtBbiUYZb4zx5QZVUCIcFl7XNUv3iGx1JltsX0C3tEUThXJXfqzgVIC4eiLoGSKRJdSYc-04BT-GWacKx81_nkTIRPlqb8nhcJg",
    desc: "Soft & sculptural vow exchange with hand-built clay aisle runners and taper candles.",
    flow: "6-12 Months Flow",
    price: "From $3,400",
    vertical: "wedding",
  },
  {
    title: "Sunny Jubilee",
    category: "Milestone 80th",
    bgClass: "bg-butter-sun/35",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXvMJ8lTnJ5L6xzsxb4gU6vx-DrD66RZS_rjmorPffbFG5VmBseosYMrDSur6TtlawtfbGwX4na_NVC5hxlv4yXgpSNCEFuSP101HpxjJ_jVOVln7dH1UKZjMFS35ykuSOtofqmuC2cPV0ITgrwGoOLJkXRAdUFX-YCYWrgmMP_Ob5owDNkV5hRoWvXuFh7hu5p2VHlemZOQO8Q0eonN8Cd5RCqjNFv6_42yCRhgkmV70EosnUlJhXVg",
    desc: "For brighter mornings & golden years. Acoustic folk duos, citrus cordials, and woven paper memoirs.",
    flow: "4-8 Weeks Flow",
    price: "From $1,800",
    vertical: "milestone",
  },
  {
    title: "Garden Feast",
    category: "Farm Gathering",
    bgClass: "bg-sage-soft",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTS-DDGqaeSMvc9WNNFek1JffuZDl8eiZFlZec_Lg1iQE1RXYN_esamtSSI-K1N24Rxr2wdnBS9USsZpa-o8WTCobOtGAyO4upr4T7bCDL8UeKzMCENXI4-w741jIKTMHlToxGn9SmfKV8JUijlnARzwE9uLuf1HJ7rAO8WAvSSZWvXWwC8nvynVEAuMVHwQcUCY8NIevHUGMs7NWY5Zk9Q5FfYk8sGZl2RQjegaAPA5wZRcgfmlQ-g",
    desc: "Small joys daily. Communal earthenware dining, sourdough kneading stations, and natural wines.",
    flow: "2-3 Months Flow",
    price: "From $2,200",
    vertical: "community",
  },
  {
    title: "Artisan Fair",
    category: "Makers Harvest",
    bgClass: "bg-surface-container-high",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvKsxWNtbP8DbGL3exBuHVBqaL42RA-ecBXmy3ahos4mVogMmDU6robwKI5R8yvdOHNT3I6fc6EmATmingdnqK_xztlAwePlrrgC8-eAlgzJXxzY-oCu860a7G0sFxtQulfJb8pr4ZBjdmxp5qSsXFbz3nsCGN8qBCXsTMlx3NFyPbkjGiD77tEF7_ee6P-AypBU_USZLdE6rervZabiGqDj4Gt9biU4suDyvoFxfyA-NZOcPshhjpgg",
    desc: "A vibrant open atelier gathering for civic harvests, wheel throwing workshops, and folk celebrations.",
    flow: "Open Cohort",
    price: "From $1,450",
    vertical: "community",
  },
];

function TemplateCard({ item }: { item: TemplateItem }): ReactElement {
  return (
    <Link
      to={`/plan-wizard?vertical=${item.vertical}`}
      className="group flex flex-col bg-cream-surface rounded-[2rem] p-space-md shadow-[0_4px_16px_-2px_rgba(122,40,50,0.06)] hover:shadow-[0_12px_28px_-4px_rgba(122,40,50,0.14)] transition-all duration-300 hover:-translate-y-1 text-left"
    >
      <div
        className={`w-full ${item.bgClass} rounded-t-[5rem] rounded-b-[1.25rem] p-space-md flex flex-col items-center justify-center relative overflow-hidden h-64`}
      >
        <img
          className="w-36 h-48 object-cover rounded-t-[4.5rem] rounded-b-xl shadow-sm transform group-hover:scale-105 transition-transform duration-300"
          alt={item.title}
          src={item.imgUrl}
        />
        <span className="absolute top-4 left-4 bg-cream-linen font-label-sm text-label-sm text-wine-deep px-space-xs py-0.5 rounded-full shadow-xs font-bold">
          {item.category}
        </span>
      </div>
      <div className="mt-space-md flex flex-col text-center items-center">
        <h3 className="font-headline-sm text-headline-sm text-wine-deep group-hover:text-wine-accent transition-colors font-bold">
          {item.title}
        </h3>
        <p className="font-body-sm text-body-sm text-text-muted mt-1">{item.desc}</p>
        <div className="mt-space-md w-full pt-space-sm flex items-center justify-between text-secondary font-label-sm text-label-sm">
          <span>{item.flow}</span>
          <span className="font-bold text-wine-deep">{item.price}</span>
        </div>
      </div>
    </Link>
  );
}

/**
 * 4 Arched Pastel Cards section ("Made Slowly, Shaped by Hand").
 */
export function HomeTemplatesSection(): ReactElement {
  return (
    <section className="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter py-space-xl">
      <div className="flex flex-col items-center text-center mb-space-xl">
        <div className="flex items-center gap-space-sm mb-space-xs text-wine-accent">
          <DaisySvg petalColor="#F2BEB9" centerColor="#F3CE72" size={24} />
          <span className="font-label-lg text-label-lg tracking-widest uppercase text-secondary font-bold">
            Bespoke Blueprints
          </span>
          <DaisySvg petalColor="#F2BEB9" centerColor="#F3CE72" size={24} />
        </div>
        <h2 className="font-headline-lg text-headline-lg text-wine-deep mb-space-xs">
          Made Slowly, Shaped by Hand
        </h2>
        <WavyDivider />
        <p className="font-body-md text-body-md text-text-muted max-w-md">
          Every milestone deserves intentional rhythm. Explore our four handcrafted templates ready
          to be molded into your vision.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
        {TEMPLATES.map((card) => (
          <TemplateCard key={card.title} item={card} />
        ))}
      </div>
    </section>
  );
}
