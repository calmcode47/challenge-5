import type { ReactElement } from "react";
import { Link } from "react-router";
import { Header } from "../../components/layout/Header.js";
import { Footer } from "../../components/layout/Footer.js";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";

/**
 * 404 Not Found fallback page for unrecognized studio routes.
 */
export function NotFoundPage(): ReactElement {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Header />
      <main
        id="main-content"
        className="w-full pt-28 pb-16 flex-1 flex flex-col items-center justify-center text-center px-4"
      >
        <div className="w-20 h-20 rounded-full bg-blush-petal/40 flex items-center justify-center text-wine-accent mb-space-md">
          <MaterialIcon name="explore_off" size={40} />
        </div>
        <h1
          tabIndex={-1}
          className="font-headline-lg text-headline-lg text-wine-deep font-bold mb-space-xs"
        >
          Uncharted Studio Room (404)
        </h1>
        <p className="font-body-md text-body-md text-text-muted max-w-md mb-space-lg">
          The celebratory blueprint you are looking for has been tucked into an unlisted atelier
          shelf.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-space-xs px-space-xl py-space-sm rounded-full bg-wine-accent text-cream-linen font-label-lg text-label-lg hover:bg-wine-deep shadow-md font-bold"
        >
          <MaterialIcon name="arrow_back" size={18} />
          <span>Return to Studio Home</span>
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default NotFoundPage;
