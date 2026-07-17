'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [userType, setUserType] = useState<'ADMIN' | 'AGENT'>('ADMIN');

  return (
    <LoginForm
      userType={userType}
      onSwitchType={() => setUserType(userType === 'ADMIN' ? 'AGENT' : 'ADMIN')}
    />
  );
}
