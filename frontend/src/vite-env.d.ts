/// <reference types="vite/client" />

import type { ReactElement } from "react";
import type { AxeMatchers } from "vitest-axe";

declare global {
  namespace JSX {
    type Element = ReactElement;
  }
}

declare module "vitest" {
  interface Assertion<T = unknown> extends AxeMatchers {
    _axeMarker?: T;
  }
  interface AsymmetricMatchersContaining extends AxeMatchers {
    _axeAsymmetricMarker?: boolean;
  }
}
