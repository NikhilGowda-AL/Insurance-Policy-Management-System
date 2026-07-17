'use client';

import LoginForm from '@/components/auth/LoginForm';

export default function AdminLoginPage() {
  return (
    <LoginForm
      userType="ADMIN"
      onSwitchType={() => window.location.href = '/agent/login'}
    />
  );
}
