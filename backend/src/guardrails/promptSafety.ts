const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /system\s*(prompt|message)/i,
  /reveal\s+(your|the)\s+(prompt|instructions|secret)/i,
  /<\s*\/?(?:system|instructions?)\b/i,
  /(?:api[_ -]?key|password|secret)\s*[:=]/i,
];

/** Rejects instructions that attempt to repurpose a user-provided planning note. */
export function isUnsafePrompt(value: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

/** Removes control characters before a note is included in an LLM boundary. */
export function normalizeUserText(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
}
