import type { ReactNode } from "react";
import { Tabs as RadixTabs } from "radix-ui";

/**
 * Props for the Tabs root container.
 */
export interface TabsProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (val: string) => void;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Root container for accessible WAI-ARIA tabs interface wrapping Radix Tabs.
 *
 * @param props - TabsProps
 * @returns JSX.Element
 */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className = "",
  children,
}: TabsProps): JSX.Element {
  return (
    <RadixTabs.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={`flex flex-col w-full ${className}`}
    >
      {children}
    </RadixTabs.Root>
  );
}

/**
 * Props for the Tabs list bar.
 */
export interface TabsListProps {
  readonly "aria-label"?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Accessible tablist container for tab navigation buttons.
 *
 * @param props - TabsListProps
 * @returns JSX.Element
 */
export function TabsList({
  "aria-label": ariaLabel = "Navigation Tabs",
  className = "",
  children,
}: TabsListProps): JSX.Element {
  return (
    <RadixTabs.List
      aria-label={ariaLabel}
      className={`flex items-center gap-1.5 p-1 rounded-[var(--radius-control)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-x-auto ${className}`}
    >
      {children}
    </RadixTabs.List>
  );
}

/**
 * Props for an individual Tab trigger button.
 */
export interface TabTriggerProps {
  readonly value: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Interactive tab button with keyboard roving tabindex and active indicator.
 *
 * @param props - TabTriggerProps
 * @returns JSX.Element
 */
export function TabTrigger({
  value,
  disabled = false,
  className = "",
  children,
}: TabTriggerProps): JSX.Element {
  return (
    <RadixTabs.Trigger
      value={value}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] text-sm font-medium rounded-[var(--radius-control)] text-[var(--color-muted)] transition-colors outline-none cursor-pointer select-none data-[state=active]:bg-[var(--color-raised)] data-[state=active]:text-[var(--color-accent)] data-[state=active]:shadow-sm hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

/**
 * Props for Tab content panel.
 */
export interface TabContentProps {
  readonly value: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Content panel associated with a specific tab key.
 *
 * @param props - TabContentProps
 * @returns JSX.Element
 */
export function TabContent({ value, className = "", children }: TabContentProps): JSX.Element {
  return (
    <RadixTabs.Content
      value={value}
      className={`pt-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[var(--radius-control)] ${className}`}
    >
      {children}
    </RadixTabs.Content>
  );
}
