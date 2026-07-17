import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { agentService } from '../services/agent.service';
import { MESSAGES } from '../constants/messages';

export const createAgent = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const agent = await agentService.createAgent(name, email, password);
  ApiResponse.success(res, 201, MESSAGES.AGENT.CREATED, { agent });
});

export const listAgents = asyncHandler(async (req: Request, res: Response) => {
  const { agents, meta } = await agentService.listAgents(req.query as Record<string, string>);
  ApiResponse.success(res, 200, 'Agents fetched', { agents }, meta);
});

export const deactivateAgent = asyncHandler(async (req: Request, res: Response) => {
  const agent = await agentService.deactivateAgent(req.params.id);
  ApiResponse.success(res, 200, MESSAGES.AGENT.DEACTIVATED, { agent });
});

export const activateAgent = asyncHandler(async (req: Request, res: Response) => {
  const agent = await agentService.activateAgent(req.params.id);
  ApiResponse.success(res, 200, 'Agent activated', { agent });
});

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await agentService.getDashboardStats();
  ApiResponse.success(res, 200, 'Dashboard statistics fetched', stats);
});
