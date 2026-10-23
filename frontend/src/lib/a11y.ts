import { useId } from "react";

/**
 * Generates an accessible, collision-free HTML id with an optional prefix.
 * Sanitizes colons from React 18/19 useId for selector compatibility.
 *
 * @param prefix - Optional string prefix for semantics (e.g., 'field', 'dialog')
 * @returns Stable DOM element id string
 */
export function useStableId(prefix?: string): string {
  const reactId = useId();
  const cleanId = reactId.replace(/[^a-zA-Z0-9]/g, "");
  return prefix ? `${prefix}-${cleanId}` : `id-${cleanId}`;
}

/**
 * Combines multiple aria-describedby identifiers into a single space-separated string,
 * filtering out undefined, null, or empty values.
 *
 * @param ids - List of potential element IDs or undefined references
 * @returns Space-separated list of IDs, or undefined if no valid IDs provided
 */
export function mergeDescribedBy(
  ...ids: (string | undefined | null | false)[]
): string | undefined {
  const valid = ids.filter((id): id is string => typeof id === "string" && id.trim().length > 0);
  return valid.length > 0 ? valid.join(" ") : undefined;
}
