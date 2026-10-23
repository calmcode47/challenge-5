import type { PlanInput } from "../../contracts/planInput.js";

const STOPWORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "and",
  "any",
  "are",
  "because",
  "been",
  "before",
  "being",
  "between",
  "both",
  "but",
  "by",
  "can",
  "did",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "her",
  "here",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "into",
  "its",
  "itself",
  "just",
  "more",
  "most",
  "myself",
  "nor",
  "not",
  "now",
  "off",
  "once",
  "only",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "she",
  "should",
  "some",
  "such",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "too",
  "under",
  "until",
  "very",
  "was",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
]);

/**
 * Extracts normalized distinct tokens from a text string.
 * Strips punctuation, transforms to lowercase, filters out words shorter than 3 characters
 * and common English stopwords.
 *
 * @param text Arbitrary text to tokenize.
 * @returns Set of normalized token strings.
 */
export function extractMeaningfulTokens(text?: string): Set<string> {
  const tokens = new Set<string>();
  if (!text) {
    return tokens;
  }
  const words = text
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/);

  for (const w of words) {
    if (w.length >= 3 && !STOPWORDS.has(w)) {
      tokens.add(w);
    }
  }
  return tokens;
}

/**
 * Collects all candidate keywords and tokens originating from the user's specific event inputs.
 * Aggregates event title, location notes, cultural context, styling themes, dietary accommodations,
 * accessibility constraints, specific must-haves/avoids, occasion notes, and selected event/venue types.
 *
 * @param input Validated event configuration.
 * @returns Set of relevant lowercase tokens representing user context.
 */
export function collectUserInputTokens(input: PlanInput): Set<string> {
  const combined = new Set<string>();

  const addText = (text?: string): void => {
    for (const t of extractMeaningfulTokens(text)) {
      combined.add(t);
    }
  };

  addText(input.title);
  addText(input.locationNote);
  addText(input.cultureOrTradition);
  addText(input.style);
  addText(input.mustHaves);
  addText(input.avoid);
  addText(input.ageGroupNote);
  addText(input.occasionNote);
  addText(input.eventType.replace(/_/g, " "));
  addText(input.venueType.replace(/_/g, " "));

  for (const diet of input.dietary) {
    addText(diet);
  }
  for (const a11y of input.accessibilityNeeds) {
    addText(a11y);
  }

  return combined;
}

/**
 * Evaluates whether an idea's rationale explicitly references and aligns with the user's input context.
 *
 * Threshold: Requires at least 1 meaningful token overlap between the idea's rationale and
 * user-supplied inputs (culture, dietary, style, venue, accessibility, must-haves, notes, or title).
 * This eliminates generic non-contextual suggestions while permitting tailored recommendations.
 *
 * @param rationale Explanatory sentence accompanying the recommendation.
 * @param input User event configuration.
 * @returns True if the rationale references at least one distinct user context token.
 */
export function referencesUserInput(rationale: string, input: PlanInput): boolean {
  if (!rationale || rationale.trim().length === 0) {
    return false;
  }
  const userTokens = collectUserInputTokens(input);
  const rationaleTokens = extractMeaningfulTokens(rationale);
  for (const tok of rationaleTokens) {
    if (userTokens.has(tok)) {
      return true;
    }
  }
  return false;
}
