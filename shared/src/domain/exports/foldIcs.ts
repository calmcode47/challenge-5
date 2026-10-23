const encoder = new TextEncoder();

/**
 * Calculates the exact UTF-8 byte length of a string without multi-byte corruption.
 *
 * @param str Character or string to measure.
 * @returns Byte length in UTF-8.
 */
export function getUtf8ByteLength(str: string): number {
  return encoder.encode(str).length;
}

/**
 * Folds a single line of iCalendar text into chunks of at most 75 UTF-8 octets per RFC 5545 section 3.1.
 * Continuation lines are prefixed with a single ASCII space (byte 0x20).
 * Code-point boundaries are strictly preserved so multi-byte characters and emojis are never split.
 *
 * @param line Single content line (without trailing CRLF).
 * @param maxOctets Maximum bytes per line (default 75 per RFC 5545).
 * @returns Formatted line with RFC 5545 continuation line folds.
 */
export function foldIcsLine(line: string, maxOctets = 75): string {
  if (getUtf8ByteLength(line) <= maxOctets) {
    return line;
  }

  const chunks: string[] = [];
  let currentChunk = "";
  let currentBytes = 0;
  let isFirstLine = true;

  for (const char of line) {
    const charBytes = getUtf8ByteLength(char);
    const limit = isFirstLine ? maxOctets : maxOctets - 1; // 1 byte reserved for leading space

    if (currentBytes + charBytes > limit) {
      chunks.push(isFirstLine ? currentChunk : ` ${currentChunk}`);
      currentChunk = char;
      currentBytes = charBytes;
      isFirstLine = false;
    } else {
      currentChunk += char;
      currentBytes += charBytes;
    }
  }

  chunks.push(` ${currentChunk}`);

  return chunks.join("\r\n");
}

/**
 * Folds all lines in an iCalendar document string according to RFC 5545 rules.
 * Preserves existing CRLF line breaks and folds any lines exceeding 75 octets.
 *
 * @param icsContent Unfolded or partially folded iCalendar payload.
 * @returns Fully folded iCalendar document string using standard CRLF terminators.
 */
export function foldIcsContent(icsContent: string): string {
  const normalized = icsContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawLines = normalized.split("\n");
  const foldedLines = rawLines.map((l) => foldIcsLine(l, 75));
  return foldedLines.join("\r\n");
}
