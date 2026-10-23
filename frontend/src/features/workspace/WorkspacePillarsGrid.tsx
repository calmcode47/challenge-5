import type { ReactElement } from "react";

interface PillarItem {
  title: string;
  subtitle: string;
  tag: string;
  status: string;
  share: string;
  spent: string;
  allocated: string;
  progressPct: number;
  barColor: string;
  frameBg: string;
  imgUrl: string;
}

const PILLARS: PillarItem[] = [
  {
    title: "Venue & Dining",
    subtitle: "Farmhouse slip tables & open orchard kitchen",
    tag: "Core Pillar",
    status: "Primary",
    share: "48% Share",
    spent: "$8,200",
    allocated: "$11,500",
    progressPct: 71.3,
    barColor: "bg-wine-accent",
    frameBg: "bg-blush-petal/30",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEwv7-5OUOF5HabevDlqMwTrfMNNSGQGeghL3Y97JRWvgetHrMQnVs-A5flShL4WSJ6qymfiEsdJpMJZqGGdhnJEoyFh4d1sPTVs_ufRSI6qvmLVfshbKcwFiE7rJIAr79Ol8TX4FOJl7eXNiL4NoW162md_1S0_IJWDVruwCMjbTyfg7xE0xV4jKKtRV-eOHftrkLC6kpQOyouuiBEbiEn4YHb7ucGqD6icIXssqV4i_NV1O3xPzQHQ",
  },
  {
    title: "Photo & Film",
    subtitle: "35mm archival rolls & Super8 reel memory",
    tag: "Documentary",
    status: "Signed",
    share: "15% Share",
    spent: "$1,800",
    allocated: "$3,600",
    progressPct: 50,
    barColor: "bg-sage-earth",
    frameBg: "bg-butter-sun/30",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwYErxietR2yNpw_s8dO0NglSyTazcFitqzC_2OQa4lEOva61p5g4VYu0cA1UxF5jzqKZyiIlILWxD3y5F-ZuStHPbtR_lQDKb6weU61Z9gCjiJ8oD455-DIbpkEJAj_BoY49GjE9UNLmHzRfOp2K74icPZe6xQXg0-n03AHg-wP4MLyA81o9hu9O9L7un_6Ru7xbZ_ybWSOEoaN8196GEdZ8TJGYcLTxzLEiMYUZokjRJKewneDhA4Q",
  },
  {
    title: "Flora & Decor",
    subtitle: "Local wildflowers & raw clay bud vases",
    tag: "Sculptural",
    status: "Artisan",
    share: "12% Share",
    spent: "$1,400",
    allocated: "$2,800",
    progressPct: 50,
    barColor: "bg-blush-deep",
    frameBg: "bg-sage-soft",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSBvDp4T7vbVz260bAnxregpU_v2Gffa-Q2b5Ok9Gwn_YiYAo2OTCg21colU20XA8NCdOt2Q1z6fn7L-dyt-YFgr4yy_jJ-l0JVTiSoPf6rAd8bvqFPjEPyFBzb_wKL7LfXX8IAWXP9npLLlhnp3P2aO9riaKv8A9AWiEfGnmgmriu-GSHhC7ktxsExmzhGC2ukZ2akXsG_dPbw6TxlPWZFvTFTbwDR3uBOM7sWPBpVVLk6O1E2kXicA",
  },
  {
    title: "Acoustic & Folk",
    subtitle: "Four-piece quartet for golden-hour toast",
    tag: "Soundscape",
    status: "Tuned",
    share: "9% Share",
    spent: "$1,100",
    allocated: "$2,200",
    progressPct: 50,
    barColor: "bg-butter-sun",
    frameBg: "bg-blush-petal/40",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbDWbLTufk_U1LZg1esKVkAnUbj2anIxXlejdRB-as8CYoCsXGMRFm-rN_S4aetMkxwPQV_hPGsCUuUj2_V_gpoTTkzslJz4Rv_g6gL9qG_YbO1MLCpm7jl1WJsXKyo5WPgEA7JV_BUYSfxpauts0FA85_QySpybIGqLe1gkB8arRlK4HceqnBu2EdHfECgWixBv3EspEcLx9hCSYa7_4pzM0-1rLajZ4h9yL4tHgpSsAklDcF7oqZhw",
  },
  {
    title: "Awning Shield",
    subtitle: "Heavy cotton canvas sail canopy buffer",
    tag: "Safety Ring",
    status: "Standby",
    share: "8% Share",
    spent: "$400",
    allocated: "$1,900",
    progressPct: 21,
    barColor: "bg-secondary",
    frameBg: "bg-surface-container-high",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAywvpm9kPFsgCBIbPlALtGv5Me5SvOjBMsnAqE2hV_Z2PaJOyZqcv3YMNr4eiyUShnPanrfd2IrLLALC4bO0mCIiLdIbfUvmQEUHusLU-cbLGjPV-0MAmAxjr21H26IcBD--Zuc3y6PpthTmqC2YXyQ-QO2dQ8kZxl8RnZOIsOyhWJa45CemUvlpquzvavyA9UyKqDJ2xAJ5guOCbWAcGAzHmTI6N8cww9YERcSNRWRSkuZPRx8jrXAQ",
  },
  {
    title: "Clay Stationery",
    subtitle: "Blind-embossed letterpress with petal fiber",
    tag: "Paper Craft",
    status: "Printing",
    share: "8% Share",
    spent: "$800",
    allocated: "$2,000",
    progressPct: 40,
    barColor: "bg-primary-fixed-dim",
    frameBg: "bg-secondary-fixed/50",
    imgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqm1jGA1SzbIc0_ymEYBWvi-8SOXIrBJ72DVvQgooW7s6q4xoLLo614tLnVbvZsT_X52rdiwi81kuNqj9XGu74Nwm7qaPKzBcLSotFP2ZM0sJxNR3Hslf8mFcKNayzocyIvl6vxJ5lNin8Agh8Nl6-7_fBHrsNm9F_p_MBj46rRQIiIY1T4Q7X0WtHUPz-fB4qGhPRTW_Vxt0hztEWm2NjeaPKKW6WOJ0IAa9xJhn-19f9_ujh70sI2g",
  },
];

function PillarCard({ p }: { p: PillarItem }): ReactElement {
  return (
    <div className="group bg-cream-linen rounded-3xl p-space-sm flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col">
        <div
          className={`relative w-full aspect-[4/5] rounded-t-[48px] rounded-b-2xl overflow-hidden ${p.frameBg} flex items-center justify-center p-3 mb-space-sm`}
        >
          <img
            className="w-full h-full object-cover rounded-t-[44px] rounded-b-xl group-hover:scale-105 transition-transform duration-500"
            alt={p.title}
            src={p.imgUrl}
          />
          <div className="absolute top-3 left-3 bg-wine-deep/80 backdrop-blur-sm text-cream-linen px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
            {p.share}
          </div>
        </div>
        <div className="px-1">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
              {p.tag}
            </span>
            <span className="font-label-sm text-label-sm bg-sage-soft text-wine-deep px-1.5 py-0.5 rounded-full font-semibold">
              {p.status}
            </span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-text-primary mt-1 line-clamp-1 font-bold">
            {p.title}
          </h3>
          <p className="font-body-sm text-body-sm text-text-muted mt-0.5 line-clamp-1">
            {p.subtitle}
          </p>
        </div>
      </div>
      <div className="mt-space-md px-1 pt-space-xs bg-cream-surface/70 rounded-2xl p-space-sm">
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-label-sm text-label-sm text-text-muted font-medium">
            Spent / Cap
          </span>
          <span className="font-label-md text-label-md text-wine-deep font-bold">{p.spent}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className={`h-full ${p.barColor} rounded-full`}
            style={{ width: `${String(p.progressPct)}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1 text-label-sm font-label-sm text-text-muted">
          <span>Allocated</span>
          <span className="text-text-primary font-bold">{p.allocated}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 6-pillar craft budget allocation cards styled like the arched Soft Clay pottery cards.
 */
export function WorkspacePillarsGrid(): ReactElement {
  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
              Tactile Allocation Units
            </span>
            <svg
              className="w-16 h-2 text-wine-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 64 8"
              aria-hidden="true"
            >
              <path d="M0 4 Q 16 0, 32 4 T 64 4" />
            </svg>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-text-primary font-bold">
            Craft Pillar Budgets
          </h2>
        </div>
        <span className="font-body-sm text-body-sm text-text-muted">
          Hand-shaped reserves with active vendor tracking
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
        {PILLARS.map((p) => (
          <PillarCard key={p.title} p={p} />
        ))}
      </div>
    </section>
  );
}
