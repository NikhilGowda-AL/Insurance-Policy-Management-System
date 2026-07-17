import { maskAadhaar, maskPan, maskMobile, maskEmail } from '../utils/mask';

describe('PII masking utilities', () => {
  it('masks an Aadhaar number, keeping only the last 4 digits', () => {
    expect(maskAadhaar('123456789012')).toBe('XXXX-XXXX-9012');
  });

  it('masks a PAN, keeping the first 3 letters and 2 middle digits', () => {
    expect(maskPan('ABCDE1234F')).toBe('ABCXX12XXF');
  });

  it('masks a mobile number, keeping the first 2 and last 2 digits', () => {
    expect(maskMobile('9876543210')).toBe('98XXXXXX10');
  });

  it('masks an email local part while keeping the domain intact', () => {
    expect(maskEmail('johndoe@example.com')).toBe('jo***e@example.com');
  });

  it('returns the input unchanged when the Aadhaar length is invalid', () => {
    expect(maskAadhaar('123')).toBe('123');
  });
});
