const TABLE_PATTERN = /^[A-Za-z0-9-]{1,10}$/;

/**
 * Reads a table number from a scanned QR code. Accepted formats:
 *   digitalmenu://table/12
 *   https://any-host/table/12   (also …/t/12)
 *   https://any-host/menu?table=12
 *   12                           (plain table number)
 * Returns null when the code is not a table code.
 */
export function parseTableQr(raw: string): string | null {
  const text = raw.trim();
  if (TABLE_PATTERN.test(text)) return text;

  const pathMatch = text.match(/\/(?:table|t)\/([A-Za-z0-9-]{1,10})(?:[/?#]|$)/i);
  if (pathMatch) return pathMatch[1];

  const queryMatch = text.match(/[?&]table=([A-Za-z0-9-]{1,10})(?:&|#|$)/i);
  if (queryMatch) return queryMatch[1];

  return null;
}

/** Validates a table number typed by hand. */
export function isValidTableNumber(value: string) {
  return TABLE_PATTERN.test(value.trim());
}
