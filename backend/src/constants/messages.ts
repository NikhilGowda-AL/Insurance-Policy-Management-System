export const MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    UNAUTHORIZED: 'You must be logged in to access this resource',
    FORBIDDEN: 'You do not have permission to perform this action',
    ACCOUNT_INACTIVE: 'This account has been deactivated. Contact your administrator.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.'
  },
  AGENT: {
    CREATED: 'Agent created successfully',
    DEACTIVATED: 'Agent deactivated successfully',
    EMAIL_EXISTS: 'An account with this email already exists',
    NOT_FOUND: 'Agent not found'
  },
  CUSTOMER: {
    CREATED: 'Customer created successfully',
    UPDATED: 'Customer updated successfully',
    NOT_FOUND: 'Customer not found',
    PAN_EXISTS: 'A customer with this PAN already exists',
    AADHAAR_EXISTS: 'A customer with this Aadhaar number already exists',
    OWNERSHIP_VIOLATION: 'You can only access customers assigned to you'
  },
  POLICY: {
    ISSUED: 'Policy issued successfully',
    NOT_FOUND: 'Policy not found',
    OWNERSHIP_VIOLATION: 'You can only access policies assigned to you'
  },
  VALIDATION: {
    FAILED: 'Validation failed check entered values are correct'
  },
  GENERIC: {
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Something went wrong. Please try again later.'
  }
};
