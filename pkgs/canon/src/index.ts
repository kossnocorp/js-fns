/**
 * Canonicalizes the input value as a string to use for hashing. It sorts keys,
 * making sure deeply equal objects produce the same string.
 *
 * This version doesn't handle any instance types, such as custom classes, Date,
 * Map, Set, etc.
 *
 * @param input - The value to canonicalize.
 * @returns The canonicalized string representation of the input.
 */
export function canonize(
  input: unknown,
  seen = new WeakMap(),
  path = [],
): string {
  if (typeof input !== "object" || !input) {
    // NOTE: Traditional approach is faster than `Object.is(input, -0)`
    if (input === 0 && 1 / input === -Infinity) return "-0";
    //  NOTE: Manual replacing is faster than `JSON.stringify`
    if (typeof input === "string") return `"${input.replace(/"/g, '\\"')}"`;
    return String(input);
  }

  const seenPath = seen.get(input);
  if (seenPath) return `<ref:.${seenPath.join(".")}>`;
  seen.set(input, path);

  let canon = "";
  const isArray = Array.isArray(input);
  // NOTE: Skipping sorting for arrays improves performance. We also tried
  // using `for...in` loop for arrays but it didn't affect performance at all.
  const keys = (
    isArray ? Object.keys(input) : Object.keys(input).sort()
  ) as (keyof typeof input)[];

  for (const key of keys) {
    canon += `${key}:${canonize(input[key], seen, path.concat(key))};`;
  }

  return isArray ? `[${canon}]` : `{${canon}}`;
}
