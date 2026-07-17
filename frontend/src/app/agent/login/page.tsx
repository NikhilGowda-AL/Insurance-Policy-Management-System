'use client';

import LoginForm from '@/components/auth/LoginForm';

export default function AgentLoginPage() {
  return (
    <LoginForm
      userType="AGENT"
      onSwitchType={() => window.location.href = '/admin/login'}
    />
  );
}
