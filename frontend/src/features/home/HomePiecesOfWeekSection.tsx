import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { useUiStore } from "../../state/uiStore.js";

interface CuratedPiece {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  price: string;
}

const CURATED_PIECES: CuratedPiece[] = [
  {
    icon: "candle",
    iconBg: "bg-secondary-container",
    iconColor: "text-secondary",
    title: "Flora Saguaro Candlestick",
    subtitle: "Glazed stoneware · Sage & Cream",
    price: "$72 / set",
  },
  {
    icon: "restaurant",
    iconBg: "bg-butter-sun/30",
    iconColor: "text-wine-deep",
    title: "Farm-to-Wheel Plating Spec",
    subtitle: "3-Course Local Heirloom Tasting",
    price: "$84 / guest",
  },
  {
    icon: "music_note",
    iconBg: "bg-blush-petal/50",
    iconColor: "text-wine-deep",
    title: "Acoustic Cello & Harp Duo",
    subtitle: "Curated twilight ceremony repertoire",
    price: "$650 booking",
  },
];

function PiecesList({ onReserve }: { onReserve: () => void }): ReactElement {
  return (
    <div className="lg:col-span-5 flex flex-col">
      <div className="flex items-center gap-2 mb-space-xs">
        <span className="w-8 h-8 rounded-full bg-blush-petal flex items-center justify-center text-wine-accent">
          <MaterialIcon name="verified" size={18} />
        </span>
        <span className="font-label-lg text-label-lg text-wine-deep font-bold">
          Curated Elements
        </span>
      </div>
      <h2 className="font-headline-lg text-headline-lg text-wine-deep leading-tight font-bold">
        Pieces of the Week
      </h2>
      <p className="font-body-md text-body-md text-text-muted mt-space-xs mb-space-md">
        Fresh handcrafted finds ready to insert into your celebration blueprint. From sculptural
        candlestick trios to seasonal farm menus.
      </p>

      <div className="flex flex-col gap-space-sm">
        {CURATED_PIECES.map((piece) => (
          <div
            key={piece.title}
            className="flex items-center justify-between p-space-sm bg-cream-linen rounded-xl shadow-xs"
          >
            <div className="flex items-center gap-space-sm">
              <span
                className={`w-8 h-8 rounded-full ${piece.iconBg} flex items-center justify-center ${piece.iconColor}`}
              >
                <MaterialIcon name={piece.icon} size={18} />
              </span>
              <div>
                <div className="font-headline-sm text-body-md text-wine-deep font-bold">
                  {piece.title}
                </div>
                <div className="font-body-sm text-body-sm text-text-muted">{piece.subtitle}</div>
              </div>
            </div>
            <span className="font-label-lg text-label-lg text-wine-accent font-bold">
              {piece.price}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-space-lg">
        <button
          type="button"
          onClick={onReserve}
          className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-wine-accent text-cream-linen font-label-lg text-label-lg hover:bg-wine-deep transition-all shadow-[0_4px_12px_rgba(122,40,50,0.18)] font-bold active:scale-95"
        >
          <span>Reserve into Plan</span>
          <MaterialIcon name="bookmark_add" size={18} />
        </button>
      </div>
    </div>
  );
}

function PiecesGallery(): ReactElement {
  return (
    <div className="lg:col-span-7 flex flex-col md:flex-row items-center justify-center gap-space-md">
      <div className="relative rounded-[2rem] overflow-hidden shadow-[0_12px_28px_rgba(122,40,50,0.12)] bg-cream-linen p-space-sm">
        <img
          className="w-full sm:w-64 h-80 object-cover rounded-[1.5rem]"
          alt="Ceramic tableware and Good Clay volume 1 book"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKxESm_4C6JyRWdPIihg3BipdnBKVsR8Lu3obKhGtNzAoaUG3d_bsye-GadRfLThtIT7AEw2jI62-MIV9lLxJElbMIrhvP0pTZAqfGn28Ibapw3vL5EL6N_awlb-eqdBbLfdkKyCpYEVySf7Xu2-yfW8Xi2_0YwhFwC4Zd-Ryyew4mwrDYEyt3UtbYzsVZDQJeCTDp50rTevsEZpuzzFgedzbhhukEbhiS14cDZTRud-y7YbzHyATAOg"
        />
        <div className="absolute bottom-5 left-5 right-5 bg-wine-deep/85 backdrop-blur-md p-space-xs rounded-xl text-cream-linen flex items-center justify-between">
          <span className="font-label-sm text-label-sm">Studio Still Life</span>
          <span className="text-butter-sun font-label-sm text-label-sm font-bold">
            Good Clay vol. 1
          </span>
        </div>
      </div>

      <div className="relative rounded-[2rem] overflow-hidden shadow-[0_12px_28px_rgba(122,40,50,0.12)] bg-cream-linen p-space-sm">
        <img
          className="w-full sm:w-64 h-80 object-cover rounded-[1.5rem]"
          alt="Hand-thrown ceramic daisy pitcher"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFtWluQ7QrG9H9UH8a5lclZEqb8PWOzNAfslpdzFoCFHfvTTQbx51b5gjO7wHcD-G9uwsEX5zR-3y0kCsZG5lkYvtHmFLmvpgS7fQH6Jv96_V5fMR3QpZkGCz90hn4Fvw56cWZ6yCF3Lj8-zYxgp8MaRF1KF2re7YOgaYdHvftTExov3clLEfAl8aF_8HEUIcthrG0WrLB72imHQM3yDB4Yd3NILQcelzJtDJXhLcAGK9U8WkkOilgMg"
        />
        <div className="absolute top-5 right-5 bg-butter-sun text-wine-deep font-label-sm text-label-sm px-space-sm py-1 rounded-full shadow-xs font-bold">
          Daisy Pitcher
        </div>
      </div>
    </div>
  );
}

/**
 * Pieces of the Week curated elements section with still life ceramic imagery.
 */
export function HomePiecesOfWeekSection(): ReactElement {
  const { showNotification } = useUiStore();

  const handleReserve = (): void => {
    showNotification("Flora Candlestick set added to your active blueprint draft.", "success");
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter py-space-xl">
      <div className="relative bg-surface-container-high rounded-[2.5rem] p-space-lg md:p-space-2xl overflow-hidden shadow-[0_8px_30px_rgba(122,40,50,0.08)]">
        <div
          className="absolute top-0 left-0 w-full h-3 pointer-events-none select-none"
          style={{
            backgroundImage: "radial-gradient(circle at 12px 0, transparent 12px, #f6e4e4 13px)",
            backgroundSize: "24px 16px",
          }}
          aria-hidden="true"
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <PiecesList onReserve={handleReserve} />
          <PiecesGallery />
        </div>
      </div>
    </section>
  );
}
