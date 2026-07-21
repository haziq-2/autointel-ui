import type { VinValidationResult } from "./types";

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

export function normalizeVinInput(raw: string): string {
  return raw.trim().toUpperCase();
}

export function validateVin(raw: string): VinValidationResult {
  const normalized = normalizeVinInput(raw);

  if (normalized.length === 0) {
    return { valid: false, message: "Enter a 17-character VIN." };
  }

  if (normalized.length !== 17) {
    return {
      valid: false,
      message: `VIN must be exactly 17 characters (${normalized.length} entered).`,
    };
  }

  if (/[IOQ]/.test(normalized)) {
    return {
      valid: false,
      message: "VIN cannot contain the letters I, O, or Q.",
    };
  }

  if (!VIN_PATTERN.test(normalized)) {
    return {
      valid: false,
      message: "VIN contains invalid characters. Use letters A–Z (except I, O, Q) and digits 0–9.",
    };
  }

  return { valid: true, normalized };
}

export function isValidVin(raw: string): boolean {
  return validateVin(raw).valid;
}
