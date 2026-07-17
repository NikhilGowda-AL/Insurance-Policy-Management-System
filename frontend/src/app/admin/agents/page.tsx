'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/ui/Loader';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { useAuthStore } from '@/store/auth.store';
import { useDebounce } from '@/hooks/useDebounce';
import { listAgentsRequest, createAgentRequest, deactivateAgentRequest, activateAgentRequest } from '@/services/agent.service';
import { normalizeApiError } from '@/utils/errors';
import { formatDate } from '@/utils/format';
import { Agent, PaginationMeta } from '@/types';

const agentSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),

    email: z.string().email('Enter a valid email address'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include an uppercase letter')
      .regex(/[a-z]/, 'Include a lowercase letter')
      .regex(/[0-9]/, 'Include a number'),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm the password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type AgentFormValues = z.infer<typeof agentSchema>;

function AgentsContent() {
  const user = useAuthStore((s) => s.user)!;
  const [agents, setAgents] = useState<Agent[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Agent | null>(null);
  const [activateTarget, setActivateTarget] = useState<Agent | null>(null);
  const [deactivating, setDeactivating] = useState(false);
  const [activating, setActivating] = useState(false);
  const debouncedSearch = useDebounce(search);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AgentFormValues>({ resolver: zodResolver(agentSchema) });

  const loadAgents = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await listAgentsRequest({ search: debouncedSearch, status, page, limit: 10 });
        setAgents(res.agents);
        setMeta(res.meta);
      } catch {
        toast.error('Could not load agents');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, status]
  );

  useEffect(() => {
    loadAgents(1);
  }, [loadAgents]);

  async function onCreateAgent(values: AgentFormValues) {
  try {
    const { confirmPassword, ...payload } = values;

    await createAgentRequest(payload);

    toast.success('Agent created successfully');
    setCreateOpen(false);
    reset();
    loadAgents(1);
  } catch (error) {
    const normalized = normalizeApiError(error);
    toast.error(normalized.message);
  }
}

  async function handleDeactivate() {
    if (!deactivateTarget) return;
    setDeactivating(true);
    try {
      await deactivateAgentRequest(deactivateTarget.id);
      toast.success('Agent deactivated');
      setDeactivateTarget(null);
      loadAgents(meta.page);
    } catch {
      toast.error('Could not deactivate agent');
    } finally {
      setDeactivating(false);
    }
  }

  async function handleActivate() {
    if (!activateTarget) return;
    setActivating(true);
    try {
      await activateAgentRequest(activateTarget.id);
      toast.success('Agent activated');
      setActivateTarget(null);
      loadAgents(meta.page);
    } catch {
      toast.error('Could not activate agent');
    } finally {
      setActivating(false);
    }
  }

  return (
    <DashboardShell user={user} title="Agents">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Search agents by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Button onClick={() => setCreateOpen(true)}>
          <UserPlus className="h-4 w-4" /> New Agent
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <Button
          variant={status === 'all' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setStatus('all')}
        >
          All
        </Button>
        <Button
          variant={status === 'active' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setStatus('active')}
        >
          Active
        </Button>
        <Button
          variant={status === 'inactive' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setStatus('inactive')}
        >
          Inactive
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-surface shadow-sm">
        {loading ? (
          <SkeletonList rows={6} />
        ) : agents.length === 0 ? (
          <EmptyState
            title="No agents found"
            description="Create your first agent to start onboarding customers."
            action={<Button onClick={() => setCreateOpen(true)}>Create Agent</Button>}
          />
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Joined</Th>
                  <Th />
                </tr>
              </Thead>
              <Tbody>
                {agents.map((agent) => (
                  <Tr key={agent.id}>
                    <Td className="font-medium">{agent.name}</Td>
                    <Td className="text-muted">{agent.email}</Td>
                    <Td>
                      <Badge variant={agent.active ? 'success' : 'neutral'}>
                        {agent.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td className="font-mono-tab text-muted">{formatDate(agent.createdAt)}</Td>
                    <Td>
                      <div className="flex gap-2">
                        {agent.active ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeactivateTarget(agent)}
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActivateTarget(agent)}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination meta={meta} onPageChange={(page) => loadAgents(page)} />
          </>
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Agent">
        <form onSubmit={handleSubmit(onCreateAgent)} className="space-y-4" noValidate>
          <Input label="Full name" error={errors.name?.message} {...register('name')} />
          <Input label="Email address" type="email" error={errors.email?.message} {...register('email')} />
          <Input
            label="Password"
            type="password"
            hint="At least 8 characters, with an uppercase letter, lowercase letter, and a number"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm password"
            type="password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create Agent
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deactivateTarget}
        title="Deactivate agent"
        message={`${deactivateTarget?.name ?? 'This agent'} will lose access immediately. This can be reversed by a database administrator if needed.`}
        confirmLabel="Deactivate"
        variant="danger"
        loading={deactivating}
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateTarget(null)}
      />

      <ConfirmDialog
        open={!!activateTarget}
        title="Activate agent"
        message={`${activateTarget?.name ?? 'This agent'} will regain access immediately.`}
        confirmLabel="Activate"
        variant="default"
        loading={activating}
        onConfirm={handleActivate}
        onCancel={() => setActivateTarget(null)}
      />
    </DashboardShell>
  );
}

export default function AgentsPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allow={['ADMIN']}>
        <AgentsContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
