import "@testing-library/jest-dom/vitest";
import * as matchers from "vitest-axe/matchers";
import type { ReactNode } from "react";
import React from "react";
import { expect, vi } from "vitest";

expect.extend(matchers);

// Mock HTMLCanvasElement.prototype.getContext for jsdom
if (typeof HTMLCanvasElement !== "undefined") {
  const mockContext = new Proxy(
    {
      getExtension: (name: string) =>
        name === "WEBGL_lose_context" ? { loseContext: () => undefined } : null,
    },
    {
      get(target, prop) {
        if (prop in target) {
          return target[prop as keyof typeof target];
        }
        return () => undefined;
      },
    }
  );

  HTMLCanvasElement.prototype.getContext = ((type: string) => {
    if (type === "webgl" || type === "webgl2") {
      return mockContext as WebGLRenderingContext;
    }
    return null;
  }) as typeof HTMLCanvasElement.prototype.getContext;
}

// Polyfill Element pointer capture and scrolling methods for Radix primitives in jsdom
if (typeof Element !== "undefined") {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => undefined;
  Element.prototype.releasePointerCapture = () => undefined;
  Element.prototype.scrollIntoView = () => undefined;
}

// Polyfill window.matchMedia
if (typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

// Polyfill ResizeObserver
if (typeof window.ResizeObserver !== "function") {
  window.ResizeObserver = class ResizeObserver {
    observe(): void {
      // noop
    }
    unobserve(): void {
      // noop
    }
    disconnect(): void {
      // noop
    }
  };
}

// Polyfill IntersectionObserver
if (typeof window.IntersectionObserver !== "function") {
  window.IntersectionObserver = class IntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: readonly number[] = [];
    observe(): void {
      // noop
    }
    unobserve(): void {
      // noop
    }
    disconnect(): void {
      // noop
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };
}

// Polyfill window.scrollTo
if (typeof window.scrollTo !== "function") {
  window.scrollTo = () => undefined;
}

// Polyfill requestIdleCallback and cancelIdleCallback
if (typeof window !== "undefined") {
  if (typeof window.requestIdleCallback !== "function") {
    window.requestIdleCallback = (cb: IdleRequestCallback): number => {
      const timer = setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining: () => 50,
        });
      }, 0);
      return Number(timer);
    };
  }
  if (typeof window.cancelIdleCallback !== "function") {
    window.cancelIdleCallback = (id: number): void => {
      clearTimeout(id);
    };
  }
}

// Polyfill crypto.randomUUID if absent
if (typeof globalThis.crypto.randomUUID !== "function") {
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    value: () => "00000000-0000-4000-8000-000000000000",
  });
}

// Mock @react-three/fiber Canvas in jsdom test environment (M07-T7 / L03)
vi.mock("@react-three/fiber", () => ({
  Canvas: ({
    children,
    className,
    ...props
  }: {
    readonly children?: ReactNode;
    readonly className?: string;
    readonly [key: string]: unknown;
  }) =>
    React.createElement(
      "div",
      {
        "data-testid": "r3f-canvas",
        className,
        role: "presentation",
        ...props,
      },
      children
    ),
  useFrame: (cb: (state: unknown, delta: number) => void) => {
    if (typeof cb === "function") {
      cb({ size: { width: 1920, height: 1080 }, clock: { getElapsedTime: () => 1.0 } }, 0.016);
    }
  },
  useThree: (selector?: (state: unknown) => unknown) => {
    const state = { gl: { domElement: document.createElement("canvas") }, scene: {} };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

// Mock @react-three/drei procedural lighting in jsdom
vi.mock("@react-three/drei", () => ({
  Environment: ({ children }: { readonly children?: ReactNode }) =>
    React.createElement("div", { "data-testid": "drei-environment" }, children),
  Lightformer: () => React.createElement("div", { "data-testid": "drei-lightformer" }),
}));

vi.mock("@react-three/drei/core/Environment.js", () => ({
  Environment: ({ children }: { readonly children?: ReactNode }) =>
    React.createElement("div", { "data-testid": "drei-environment" }, children),
}));

vi.mock("@react-three/drei/core/Lightformer.js", () => ({
  Lightformer: () => React.createElement("div", { "data-testid": "drei-lightformer" }),
}));
