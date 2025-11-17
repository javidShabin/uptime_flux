import { Types } from "mongoose";
import { AlertPolicyModel, type IAlertPolicy, type AlertPolicyRules, type AlertPolicyChannels } from "./alertPolicy.model.js";
import { MonitorModel, type IMonitor } from "../monitor/monitor.model.js";
import { CheckModel } from "../monitor/check.model.js";
import { IncidentModel, IncidentStatus } from "../monitor/incident.model.js";
import { AlertPolicyError } from "./alertPolicy.errors.js";
import type {
  CreateAlertPolicyInput,
  UpdateAlertPolicyInput,
} from "./alertPolicy.schemas.js";

export interface AlertPolicyResponse {
  id: string;
  projectId: string;
  name: string;
  rules: AlertPolicyRules;
  channels: AlertPolicyChannels;
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyEvaluationResult {
  action: "open" | "resolve" | "none";
}

interface ICheck {
  status: "up" | "down" | "degraded";
  ts?: Date;
}

export class AlertPolicyService {
  constructor() {}

  /**
   * Convert alert policy document to response format
   */
  private toResponse(policy: IAlertPolicy): AlertPolicyResponse {
    return {
      id: policy.id,
      projectId: policy.projectId.toString(),
      name: policy.name,
      rules: policy.rules,
      channels: policy.channels,
      createdAt: policy.createdAt,
      updatedAt: policy.updatedAt,
    };
  }

  /**
   * Create a new alert policy
   */
  async createPolicy(
    projectId: string,
    data: CreateAlertPolicyInput
  ): Promise<AlertPolicyResponse> {
    if (!Types.ObjectId.isValid(projectId)) {
      throw new AlertPolicyError(400, "Invalid project ID format");
    }

    const policy = await AlertPolicyModel.create({
      projectId: new Types.ObjectId(projectId),
      name: data.name,
      rules: data.rules,
      channels: data.channels,
    });

    return this.toResponse(policy);
  }

  /**
   * Update an alert policy
   */
  async updatePolicy(
    id: string,
    data: UpdateAlertPolicyInput
  ): Promise<AlertPolicyResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AlertPolicyError(400, "Invalid policy ID format");
    }

    const policy = await AlertPolicyModel.findById(id);

    if (!policy) {
      throw new AlertPolicyError(404, "Alert policy not found");
    }

    if (data.name !== undefined) policy.name = data.name;
    if (data.rules !== undefined) policy.rules = data.rules;
    if (data.channels !== undefined) policy.channels = data.channels;

    await policy.save();

    return this.toResponse(policy);
  }

  /**
   * Delete an alert policy
   */
  async deletePolicy(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AlertPolicyError(400, "Invalid policy ID format");
    }

    const result = await AlertPolicyModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new AlertPolicyError(404, "Alert policy not found");
    }
  }

  /**
   * Get all policies for a project
   */
  async getPolicies(projectId: string): Promise<AlertPolicyResponse[]> {
    if (!Types.ObjectId.isValid(projectId)) {
      throw new AlertPolicyError(400, "Invalid project ID format");
    }

    const policies = await AlertPolicyModel.find({
      projectId: new Types.ObjectId(projectId),
    }).sort({ createdAt: -1 });

    return policies.map((policy) => this.toResponse(policy));
  }

  /**
   * Get policy for a monitor (match by projectId, pick first or default)
   */
  async getPolicyForMonitor(monitor: IMonitor): Promise<IAlertPolicy | null> {
    if (!monitor.projectId) {
      return null;
    }

    const policy = await AlertPolicyModel.findOne({
      projectId: monitor.projectId,
    }).sort({ createdAt: 1 });

    return policy;
  }

  /**
   * Evaluate policy based on last checks
   */
  async evaluatePolicy(
    monitor: IMonitor,
    lastChecks: ICheck[]
  ): Promise<PolicyEvaluationResult> {
    const policy = await this.getPolicyForMonitor(monitor);

    if (!policy) {
      // No policy means no action
      return { action: "none" };
    }

    const { failConsecutive, recoverConsecutive } = policy.rules;

    // Need at least failConsecutive or recoverConsecutive checks
    const minChecksNeeded = Math.max(failConsecutive, recoverConsecutive);
    if (lastChecks.length < minChecksNeeded) {
      return { action: "none" };
    }

    // Get the most recent N checks for fail evaluation
    const recentFailChecks = lastChecks
      .slice(0, failConsecutive)
      .map((check) => check.status);

    // Get the most recent N checks for recover evaluation
    const recentRecoverChecks = lastChecks
      .slice(0, recoverConsecutive)
      .map((check) => check.status);

    // FAILING LOGIC: If last N checks are all "down"
    const allDown = recentFailChecks.every((status) => status === "down");
    if (allDown && recentFailChecks.length === failConsecutive) {
      return { action: "open" };
    }

    // RECOVERY LOGIC: If last N checks are all "up"
    const allUp = recentRecoverChecks.every((status) => status === "up");
    if (allUp && recentRecoverChecks.length === recoverConsecutive) {
      return { action: "resolve" };
    }

    return { action: "none" };
  }

  /**
   * Get escalation level for an incident (prepared for future use)
   */
  async getEscalationLevel(
    incidentId: string,
    policyId: string
  ): Promise<number> {
    if (!Types.ObjectId.isValid(incidentId) || !Types.ObjectId.isValid(policyId)) {
      throw new AlertPolicyError(400, "Invalid ID format");
    }

    const incident = await IncidentModel.findById(incidentId);
    const policy = await AlertPolicyModel.findById(policyId);

    if (!incident || !policy) {
      throw new AlertPolicyError(404, "Incident or policy not found");
    }

    if (incident.status === IncidentStatus.RESOLVED) {
      return 0;
    }

    const now = new Date();
    const openedAt = incident.openedAt;
    const minutesSinceOpened = Math.floor(
      (now.getTime() - openedAt.getTime()) / (1000 * 60)
    );

    const escalateAfterMin = policy.rules.escalateAfterMin;

    if (escalateAfterMin === 0) {
      return 0;
    }

    // Calculate escalation level (0 = no escalation, 1+ = escalated)
    const escalationLevel = Math.floor(minutesSinceOpened / escalateAfterMin);

    return Math.max(0, escalationLevel);
  }
}

