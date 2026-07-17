export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length !== 12) return aadhaar;
  const lastFour = aadhaar.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
}

export function maskPan(pan: string): string {
  if (!pan || pan.length !== 10) return pan;
  const first3 = pan.slice(0, 3);
  const digits = pan.slice(5, 7);
  const last = pan.slice(9, 10);
  return `${first3}XX${digits}XX${last}`;
}

export function maskMobile(mobile: string): string {
  if (!mobile || mobile.length !== 10) return mobile;
  const first2 = mobile.slice(0, 2);
  const last2 = mobile.slice(-2);
  return `${first2}XXXXXX${last2}`;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
}
