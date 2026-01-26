// Simple JWT-like token for client-side authentication
// Note: This is a basic implementation for casual protection. For production security, use a backend.

const TOKEN_KEY = 'admin_token';
const TOKEN_EXPIRY_HOURS = 8;

interface TokenPayload {
  role: string;
  iat: number;
  exp: number;
}

// Simple base64 encoding/decoding for token
function encodePayload(payload: TokenPayload): string {
  return btoa(JSON.stringify(payload));
}

function decodePayload(token: string): TokenPayload | null {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

export function generateToken(): string {
  const now = Date.now();
  const payload: TokenPayload = {
    role: 'admin',
    iat: now,
    exp: now + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
  };
  return encodePayload(payload);
}

export function validateToken(token: string | null): boolean {
  if (!token) return false;
  
  const payload = decodePayload(token);
  if (!payload) return false;
  
  // Check if token is expired
  if (Date.now() > payload.exp) {
    clearToken();
    return false;
  }
  
  // Check if role is admin
  return payload.role === 'admin';
}

export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

// Password storage (stored in localStorage for persistence)
const PASSWORD_KEY = 'admin_password';
const DEFAULT_PASSWORD = 'admin123';

export function getAdminPassword(): string {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
}

export function setAdminPassword(newPassword: string): void {
  localStorage.setItem(PASSWORD_KEY, newPassword);
}

export function verifyPassword(inputPassword: string): boolean {
  return inputPassword === getAdminPassword();
}
