import type { ReactElement } from "react";

/**
 * Root application component for Occasio.
 * Renders the primary semantic landmark and page heading.
 *
 * @returns The root React element containing the application heading.
 */
export function App(): ReactElement {
  return (
    <main id="main" tabIndex={-1}>
      <h1>Occasio</h1>
    </main>
  );
}

export default App;
