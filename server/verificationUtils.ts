import { randomInt, randomBytes, createHash, timingSafeEqual } from "crypto";

/**
 * Generates a cryptographically secure random 6-digit verification code.
 * Leading zeros are preserved (e.g., "012345").
 * 
 * @returns A 6-digit string verification code
 */
export function generateVerificationCode(): string {
  // Generate a random number between 0 and 999999 (inclusive)
  const code = randomInt(0, 1000000);
  // Pad with leading zeros to ensure 6 digits
  return code.toString().padStart(6, "0");
}

/**
 * Hashes a verification code using SHA256 with a random salt.
 * The salt is appended to the hash for later verification.
 * 
 * @param code - The plain text verification code to hash
 * @returns A string in format `${hash}.${salt}` for storage
 */
export function hashVerificationCode(code: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(code + salt)
    .digest("hex");
  return `${hash}.${salt}`;
}

/**
 * Verifies if a supplied code matches a stored hash using timing-safe comparison.
 * This prevents timing attacks by ensuring constant-time comparison.
 * 
 * @param suppliedCode - The plain text code provided by the user
 * @param storedHash - The stored hash in format `${hash}.${salt}`
 * @returns true if the codes match, false otherwise
 */
export function verifyCodeMatch(suppliedCode: string, storedHash: string): boolean {
  // Handle edge cases
  if (!suppliedCode || !storedHash || !storedHash.includes(".")) {
    return false;
  }

  const [storedHashValue, salt] = storedHash.split(".");
  
  // Validate extracted values
  if (!storedHashValue || !salt) {
    return false;
  }

  // Hash the supplied code with the same salt
  const suppliedHash = createHash("sha256")
    .update(suppliedCode + salt)
    .digest("hex");

  // Convert to buffers for timing-safe comparison
  const storedBuffer = Buffer.from(storedHashValue, "hex");
  const suppliedBuffer = Buffer.from(suppliedHash, "hex");

  // Ensure buffers are the same length before comparing
  if (storedBuffer.length !== suppliedBuffer.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, suppliedBuffer);
}

/**
 * Checks if a verification code has expired.
 * 
 * @param expiresAt - The expiration date of the verification code
 * @returns true if the code is expired, false if still valid
 */
export function isCodeExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
