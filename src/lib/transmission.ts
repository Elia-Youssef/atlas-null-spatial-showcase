import type {
  SubmissionAdapter,
  SubmissionResult,
  TransmissionPayload,
  ValidationErrors,
} from "@/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates the fields required by every transmission adapter. */
export function validateTransmission(payload: TransmissionPayload): ValidationErrors {
  const errors: ValidationErrors = {};

  if (payload.name.trim().length < 2) {
    errors.name = "Enter at least two characters.";
  }

  if (!EMAIL_PATTERN.test(payload.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (payload.brief.trim().length < 20) {
    errors.brief = "Tell us a little more—at least 20 characters.";
  }

  return errors;
}

/** Creates a deterministic-looking local receipt for the non-networked demo form. */
export function createDemoReceipt(payload: TransmissionPayload): SubmissionResult {
  const checksum = Array.from(`${payload.name}:${payload.email}`).reduce(
    (total, character) => (total * 31 + character.charCodeAt(0)) >>> 0,
    17,
  );

  return {
    success: true,
    message: "Transmission simulated. No information left this browser.",
    receiptId: `AN-${checksum.toString(16).toUpperCase().padStart(8, "0")}`,
  };
}

/** Demo-only submission adapter. It never sends or persists the provided payload. */
export const demoSubmissionAdapter: SubmissionAdapter = async (payload) => {
  await new Promise((resolve) => window.setTimeout(resolve, 650));
  return createDemoReceipt(payload);
};
