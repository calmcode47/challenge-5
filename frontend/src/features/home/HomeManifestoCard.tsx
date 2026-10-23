import type { ReactElement } from "react";

/**
 * Ceramic Atelier Manifesto card displaying pottery photograph and studio philosophy.
 */
export function HomeManifestoCard(): ReactElement {
  return (
    <div className="lg:col-span-5 flex flex-col items-center">
      <div className="relative w-full max-w-sm rounded-[2.5rem] bg-surface-container-low p-space-md shadow-[0_8px_20px_rgba(122,40,50,0.06)] flex flex-col items-center">
        <img
          className="w-full h-72 object-cover rounded-[2rem] shadow-sm mb-space-sm"
          alt="Cozy ceramic atelier study corner"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG14sATDFE5IkWj_ISkCzqkarlHrV8eLZ3Yu4P6W-zIXEU86ZR_QFVbuhP1fkcql7yuuxzatfYdid854FIASssvUAhB5E5X6WlVH4Qh-B0SRqoN98vrf23COLRH0GRZ9CNPMYfPyCwLQLZKIw70d8il9UFmKp3s_0Hb7aHoIX1REetggmlI9BhDzNbJL8iPrfg5VOvWBdUjizvbY7chMesOLZlXEhFxXue9B0HZA00K31Fw7sgTtHhNw"
        />
        <div className="w-full bg-cream-linen p-space-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="w-3 h-3 rounded-full bg-butter-sun" />
            <span className="font-label-sm text-label-sm text-wine-deep font-bold">
              Studio Manifesto
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary">Edition 2025</span>
        </div>
        <p className="font-body-sm text-body-sm text-center text-text-muted mt-space-sm px-space-xs italic">
          &ldquo;We believe gatherings are best experienced when every detail feels shaped by loving
          human hands.&rdquo;
        </p>
      </div>
    </div>
  );
}
