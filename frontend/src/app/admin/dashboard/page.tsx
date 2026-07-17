'use client';

import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/ui/StatCard';
import { PageLoader } from '@/components/ui/Loader';
import { useAuthStore } from '@/store/auth.store';
import { fetchDashboardStats, DashboardStats } from '@/services/agent.service';
import toast from 'react-hot-toast';

function AdminDashboardContent() {
  const user = useAuthStore((s) => s.user)!;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => toast.error('Could not load dashboard statistics'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell user={user} title="Admin Dashboard">
      {loading || !stats ? (
        <PageLoader label="Loading statistics" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Agents" value={stats.totalAgents} icon={Users} tone="primary" />
          <StatCard label="Active Agents" value={stats.activeAgents} icon={UserCheck} tone="accent" />
          <StatCard label="Inactive Agents" value={stats.inactiveAgents} icon={UserX} tone="danger" />
        </div>
      )}
    </DashboardShell>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allow={['ADMIN']}>
        <AdminDashboardContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
