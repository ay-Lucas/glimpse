export async function sha1Base64url(payload: string) {
  const data = new TextEncoder().encode(payload);
  const buffer = await crypto.subtle.digest("SHA-1", data);
  const bytes = new Uint8Array(buffer);

  // binary → regular base64
  let b64 = "";
  for (const b of bytes) b64 += String.fromCharCode(b);
  b64 = btoa(b64);

  // base64 → base64url
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
