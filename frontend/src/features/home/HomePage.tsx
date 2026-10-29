import type { ReactElement } from "react";
import { Header } from "../../components/layout/Header.js";
import { Footer } from "../../components/layout/Footer.js";
import { SearchDialog } from "../../components/common/SearchDialog.js";
import { HomeHero } from "./HomeHero.js";
import { HomeTemplatesSection } from "./HomeTemplatesSection.js";
import { HomeStudioPicksSection } from "./HomeStudioPicksSection.js";
import { HomePiecesOfWeekSection } from "./HomePiecesOfWeekSection.js";
import { HomeBriefFormSection } from "./HomeBriefFormSection.js";

/**
 * Soft Clay Celebrations Studio Home page component.
 */
export function HomePage(): ReactElement {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-blush-petal selection:text-wine-deep">
      <Header />
      <main id="main-content" className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)] flex-1">
        <div className="flex flex-col w-full">
          <HomeHero />
          <HomeTemplatesSection />
          <HomeStudioPicksSection />
          <HomePiecesOfWeekSection />
          <HomeBriefFormSection />
        </div>
      </main>
      <Footer />
      <SearchDialog />
    </div>
  );
}

export default HomePage;
