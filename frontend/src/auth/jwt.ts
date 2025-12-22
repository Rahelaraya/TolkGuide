type JwtPayload = Record<string, any>;

function base64UrlDecode(input: string): string {
  // base64url -> base64
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  // padding
  const pad = input.length % 4;
  if (pad) input += "=".repeat(4 - pad);

  return decodeURIComponent(
    atob(input)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}

export function getUsernameFromToken(token: string): string | null {
  const payload = parseJwt(token);
  if (!payload) return null;

  // Vanliga claims i .NET JWT:
  // - unique_name
  // - name
  // - sub (ibland)
  // - "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
  const candidates = [
    payload.unique_name,
    payload.name,
    payload.sub,
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
  ];

  const value = candidates.find((x) => typeof x === "string" && x.trim().length > 0);
  return value ?? null;
}
