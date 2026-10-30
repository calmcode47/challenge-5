import type { ReactElement } from "react";
import { Link } from "react-router";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { DaisySvg } from "../../components/common/DaisySvg.js";
import { ScallopMask } from "../../components/common/ScallopMask.js";

function HeroTicker(): ReactElement {
  return (
    <div className="w-full bg-cream-linen py-space-sm px-gutter flex items-center justify-between text-secondary">
      <div className="flex items-center gap-space-sm font-label-md text-label-md">
        <span className="w-2.5 h-2.5 rounded-full bg-butter-sun animate-pulse" />
        <span className="tracking-wide">
          Planning studio &middot; Build a practical celebration brief
        </span>
      </div>
      <div className="hidden md:flex items-center gap-space-lg font-label-sm text-label-sm text-on-surface-variant">
        <span>Clay &middot; Flora &middot; Acoustic Notes &middot; Intimate Feasts</span>
        <span className="text-wine-accent font-bold">Private browser vault</span>
      </div>
    </div>
  );
}

function HeroFlankVase(): ReactElement {
  return (
    <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center">
      <div className="relative p-space-sm bg-wine-deep/40 rounded-[2rem] shadow-[0_8px_24px_rgba(92,29,36,0.2)] transform -rotate-3 hover:rotate-0 transition-transform duration-300">
        <img
          className="w-44 h-56 object-cover rounded-[1.75rem]"
          alt="Sculptural handcrafted speckled blush pottery vase with crimson ceramic tulips"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAez6OJqlYCAGVqZyOxxUld8dLF-6pEgH9RuFr6SKqzsiiK5jdpo-WwRBK6bc2T378pq-19NH5PfMT8vqwtzk-O49Mt2sUOZrApI9jTbVGXLps0TgeIrYNSbqErSye_r1ZA-8Jhkn-M2W4op0UxHjS9nX2J0430ANFKpuWNPO0bHsigkvKxHcV3qLAjS41RtkCCTQkjJspIaKNl7cBO4A5KLnRsebCPfOocXb5BiBC0Epd_XrJTaOJ4FQ"
        />
        <div className="absolute -bottom-3 -right-3 bg-cream-linen text-wine-deep font-label-sm text-label-sm px-space-sm py-1 rounded-full shadow-sm flex items-center gap-1 font-bold">
          <MaterialIcon name="star" size={14} className="text-butter-sun" filled />
          <span>Slip-Cast No. 04</span>
        </div>
      </div>
    </div>
  );
}

function HeroCenterCopy(): ReactElement {
  return (
    <div className="lg:col-span-6 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-space-xs bg-cream-linen/15 px-space-md py-space-xs rounded-full mb-space-md text-butter-sun">
        <MaterialIcon name="temp_preferences_custom" size={18} />
        <span className="font-label-md text-label-md tracking-wider uppercase font-semibold">
          Tangible Event Alchemy
        </span>
      </div>
      <h1
        tabIndex={-1}
        className="font-headline-xl text-headline-xl text-cream-linen leading-none tracking-tight mb-space-sm"
      >
        The Joy of{" "}
        <span className="italic font-normal font-headline-xl text-butter-sun">Celebrating</span>
      </h1>
      <p className="font-body-lg text-body-lg text-blush-petal max-w-lg mb-space-xl">
        Handmade gatherings crafted for brighter days. Mold your timeline, curate artisanal
        tablescapes, and savor zero-stress celebrations.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-space-md">
        <Link
          to="/plan-wizard"
          className="inline-flex items-center gap-space-xs bg-butter-sun text-wine-deep font-label-lg text-label-lg px-space-xl py-space-md rounded-full shadow-[0_4px_16px_rgba(243,206,114,0.35)] hover:scale-105 active:scale-95 transition-all font-bold"
        >
          <MaterialIcon name="brush" size={20} />
          <span>Shape Your Celebration</span>
        </Link>
        <Link
          to="/event-workspace"
          className="inline-flex items-center gap-space-xs bg-cream-linen/10 hover:bg-cream-linen/20 text-cream-linen font-label-lg text-label-lg px-space-lg py-space-md rounded-full transition-colors font-semibold"
        >
          <MaterialIcon name="palette" size={18} />
          <span>Explore Blueprints</span>
        </Link>
      </div>

      <div className="mt-space-xl flex items-center gap-space-lg bg-wine-deep/50 px-space-lg py-space-xs rounded-full text-cream-linen font-label-md text-label-md">
        <span className="flex items-center gap-1">
          <span className="text-butter-sun">&bull;</span> Context-aware plans
        </span>
        <span className="flex items-center gap-1">
          <span className="text-blush-petal">&bull;</span> Accessible planning options
        </span>
        <span className="flex items-center gap-1">
          <span className="text-sage-soft">&bull;</span> Local plan storage
        </span>
      </div>
    </div>
  );
}

function HeroFlankMug(): ReactElement {
  return (
    <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center">
      <div className="relative p-space-sm bg-wine-deep/40 rounded-[2rem] shadow-[0_8px_24px_rgba(92,29,36,0.2)] transform rotate-3 hover:rotate-0 transition-transform duration-300">
        <img
          className="w-44 h-56 object-cover rounded-[1.75rem]"
          alt="Handmade soft cream ceramic mug with hand-painted crimson tulip emblem"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFgmU9RVZoTUvk3ht_LUCE2USJPftzPH5NZun_84EydQ5pK4PpR_UTSuhHR3Bf1EJkDvpsLHf32qZ_PSQ2P0lkDjBjBzYSqOS6ruIeoi7hQ5MsawttZ6ChZzutGTLXOSGNX8qQi2Y3-7vs9XgjUyEbTvHi2Pi00r84N-7PiQQ4BfqZ8aNf-VxmZxHRpTNPIRFDcB5ODO-BimKyIp3Y8sL_G_F-yC120M4XZOMEtiUvOnILS02JXzCHfA"
        />
        <div className="absolute -top-3 -left-3 bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm px-space-sm py-1 rounded-full shadow-sm flex items-center gap-1 font-bold">
          <MaterialIcon name="local_cafe" size={14} />
          <span>Morning Toasting Cup</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Hero section displaying deep wine ceramic box with corner daisies and flank pottery art.
 */
export function HomeHero(): ReactElement {
  return (
    <>
      <HeroTicker />
      <section className="relative w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter mt-space-md">
        <div className="relative w-full bg-wine-accent text-cream-linen rounded-t-[2.5rem] pt-space-2xl pb-16 px-space-md md:px-space-2xl overflow-hidden shadow-[0_16px_40px_-10px_rgba(122,40,50,0.28)]">
          <div className="absolute -top-4 -left-4 w-28 h-28 pointer-events-none opacity-90 select-none">
            <DaisySvg size={100} />
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 pointer-events-none opacity-90 select-none">
            <DaisySvg size={110} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <HeroFlankVase />
            <HeroCenterCopy />
            <HeroFlankMug />
          </div>
        </div>
        <ScallopMask />
      </section>
    </>
  );
}
