import { UserRole, Tier } from '../types';

interface JWTPayload {
  role: UserRole;
  plan: Tier;
  exp: number;
  iat: number;
}

// Simulate Server-Side JWT Generation
export const generateToken = (role: UserRole, plan: Tier): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    role,
    plan,
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours expiry
    iat: Date.now()
  }));
  // Simulated signature (in production, this requires a secret key)
  const signature = btoa(`sig_${Date.now()}_${Math.random()}`);
  
  return `${header}.${payload}.${signature}`;
};

// Verify and Decode Token
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payloadRaw = atob(parts[1]);
    const payload = JSON.parse(payloadRaw) as JWTPayload;

    // Check Expiry
    if (Date.now() > payload.exp) {
      console.warn("Auth Error: Token Expired");
      return null;
    }

    return payload;
  } catch (e) {
    console.error("Auth Error: Invalid Token Structure", e);
    return null;
  }
};