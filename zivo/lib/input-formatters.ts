// Format phone number as user types
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "").slice(0, 10); // ❗️Sadece ilk 10 hane alınır

  // Format based on length
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
}

// Format postal code (ZIP code)
export function formatPostalCode(value: string): string {
  // Remove all non-alphanumeric characters
  const cleaned = value.replace(/[^\w\s]/gi, "");

  // Basic format for postal codes (can be customized based on country)
  if (cleaned.length <= 5) {
    return cleaned;
  } else {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`;
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean;
  message: string;
  score: number;
} {
  let score = 0;
  const checks = [];

  // Length check
  if (password.length < 8) {
    checks.push("Password must be at least 8 characters long");
  } else {
    score += 1;
    if (password.length >= 12) score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    checks.push("Password must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    checks.push("Password must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    checks.push("Password must contain at least one number");
  } else {
    score += 1;
  }

  // Special character check (optional but adds strength)
  if (!/[^a-zA-Z0-9]/.test(password)) {
    checks.push("Consider adding a special character for stronger security");
  } else {
    score += 1;
  }

  const isValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);

  let message = "";
  if (checks.length > 0) {
    message = checks[0]; // Return the first failing check as the message
  } else if (score <= 3) {
    message = "Password is acceptable";
  } else if (score <= 5) {
    message = "Password is strong";
  } else {
    message = "Password is very strong";
  }

  return {
    isValid,
    message,
    score,
  };
}
