const FNV_PRIME_32 = 0x01000193;
const FNV_OFFSET_BASIS_32 = 0x811c9dc5;

/**
 * Computes a deterministic 32-bit FNV-1a hash formatted as an 8-character lowercase hexadecimal string.
 * Used for stable, collision-resistant identifier derivation without external cryptographic dependencies.
 *
 * @param input String to be hashed.
 * @returns 8-character hexadecimal string representing the 32-bit unsigned hash.
 */
export function fnv1a(input: string): string {
  let hash = FNV_OFFSET_BASIS_32;

  for (let idx = 0; idx < input.length; idx += 1) {
    const code = input.charCodeAt(idx);
    hash ^= code;
    hash = Math.imul(hash, FNV_PRIME_32);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}
