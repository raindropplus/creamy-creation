export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizePhone(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  let normalized = trimmed.replace(/[\s()-]/g, "");

  if (normalized.startsWith("00")) {
    normalized = `+${normalized.slice(2)}`;
  }

  // Bangladesh-friendly normalization while still supporting E.164 numbers.
  if (/^01\d{9}$/.test(normalized)) {
    normalized = `+88${normalized}`;
  } else if (/^8801\d{9}$/.test(normalized)) {
    normalized = `+${normalized}`;
  }

  return normalized;
}

export function isPhone(value: string) {
  return /^\+[1-9]\d{7,14}$/.test(normalizePhone(value));
}

export function normalizeIdentifier(value: string) {
  const trimmed = value.trim();
  return isEmail(trimmed) ? trimmed.toLowerCase() : normalizePhone(trimmed);
}
