/// <reference types="vite/client" />

import type { AxeMatchers } from "vitest-axe";

declare module "vitest" {
  interface Assertion<T = unknown> extends AxeMatchers {
    _axeMarker?: T;
  }
  interface AsymmetricMatchersContaining extends AxeMatchers {
    _axeAsymmetricMarker?: boolean;
  }
}
