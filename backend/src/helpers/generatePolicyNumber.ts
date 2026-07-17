export function generatePolicyNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `POL-${year}-${random}`;
}
