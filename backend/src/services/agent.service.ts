import { userRepository } from '../repositories/user.repository';
import { policyRepository } from '../repositories/policy.repository';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/messages';
import { UserRole } from '../constants/roles';
import { parsePagination, buildMeta } from '../helpers/pagination';
import { IUser } from '../interfaces/user.interface';

export interface AgentListQuery {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: string;
  limit?: string;
}

export interface AgentSummary {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: Date;
}

function toSummary(user: IUser): AgentSummary {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    active: user.active,
    createdAt: user.createdAt
  };
}

export class AgentService {
  async createAgent(name: string, email: string, password: string): Promise<AgentSummary> {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw ApiError.conflict(MESSAGES.AGENT.EMAIL_EXISTS, { email: 'Already in use' });
    }

    const agent = await userRepository.create({ name, email, password, role: UserRole.AGENT });
    return toSummary(agent);
  }

  async listAgents(query: AgentListQuery) {
    const { page, limit } = parsePagination(query as Record<string, unknown>);
    const { items, total } = await userRepository.findAgents({
      search: query.search,
      status: query.status || 'all',
      page,
      limit
    });

    return {
      agents: items.map(toSummary),
      meta: buildMeta(page, limit, total)
    };
  }

  async deactivateAgent(agentId: string): Promise<AgentSummary> {
    const agent = await userRepository.findById(agentId);
    if (!agent || agent.role !== UserRole.AGENT) {
      throw ApiError.notFound(MESSAGES.AGENT.NOT_FOUND);
    }

    const updated = await userRepository.setActiveStatus(agentId, false);
    if (!updated) {
      throw ApiError.notFound(MESSAGES.AGENT.NOT_FOUND);
    }

    return toSummary(updated);
  }

  async activateAgent(agentId: string): Promise<AgentSummary> {
    const agent = await userRepository.findById(agentId);
    if (!agent || agent.role !== UserRole.AGENT) {
      throw ApiError.notFound(MESSAGES.AGENT.NOT_FOUND);
    }

    const updated = await userRepository.setActiveStatus(agentId, true);
    if (!updated) {
      throw ApiError.notFound(MESSAGES.AGENT.NOT_FOUND);
    }

    return toSummary(updated);
  }

  async getDashboardStats() {
    const [totalAgents, activeAgents, inactiveAgents] = await Promise.all([
      userRepository.countByRoleAndStatus(UserRole.AGENT, true).then(async (active) => {
        const inactive = await userRepository.countByRoleAndStatus(UserRole.AGENT, false);
        return active + inactive;
      }),
      userRepository.countByRoleAndStatus(UserRole.AGENT, true),
      userRepository.countByRoleAndStatus(UserRole.AGENT, false)
    ]);

    return { totalAgents, activeAgents, inactiveAgents };
  }

  async getAgentPolicyCount(agentId: string): Promise<number> {
    return policyRepository.countByAgent(agentId);
  }
}

export const agentService = new AgentService();
