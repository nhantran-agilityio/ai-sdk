import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type OpenAIStreamError = {
  error?: {
    type?: string;
    code?: string;
    message?: string;
  };
  status?: number;
};

/**
 * Type guard check object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Extract error info an toàn
 */
export function normalizeOpenAIError(error: unknown): OpenAIStreamError {
  if (!isObject(error)) return {};

  const maybeError = error as OpenAIStreamError;

  return {
    error: maybeError.error,
    status: maybeError.status,
  };
}

/**
 * Map OpenAI error → UI friendly message
 */
export function mapOpenAIErrorToMessage(error: unknown): string {
  const err = normalizeOpenAIError(error);

  if (err.error?.type === "insufficient_quota") {
    return "Your OpenAI quota has been exceeded. Please check your billing.";
  }

  if (err.status === 401) {
    return "Invalid API key.";
  }

  if (err.status === 429) {
    return "Rate limit exceeded. Please try again.";
  }

  if (err.error?.code === "context_length_exceeded") {
    return "Your message is too long. Please shorten it.";
  }

  return "Unexpected AI error occurred.";
}

/**
 * Optional: return structured error code for frontend
 */
export function mapOpenAIErrorToCode(error: unknown): string {
  const err = normalizeOpenAIError(error);

  if (err.error?.type === "insufficient_quota") return "INSUFFICIENT_QUOTA";
  if (err.status === 401) return "INVALID_API_KEY";
  if (err.status === 429) return "RATE_LIMIT";

  return "UNKNOWN_ERROR";
}

export function parseChatError(error: Error | null) {
  if (!error) return null;

  try {
    const parsed = JSON.parse(error.message);
    return parsed.message || error.message;
  } catch {
    return error.message;
  }
}
