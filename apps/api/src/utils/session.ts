import type { FastifyInstance } from "fastify";
import crypto from "node:crypto";

export interface SessionData {
  userId: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  lastActivity: Date;
}

export class SessionManager {
  private readonly sessionPrefix = "session:";
  private readonly userSessionsPrefix = "user:sessions:";
  private readonly sessionTtl = 7 * 24 * 60 * 60; // 7 days in seconds

  /**
   * Create a new session
   */
  async createSession(
    app: FastifyInstance,
    userId: string,
    email: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    const sessionId = crypto.randomUUID();
    const sessionKey = `${this.sessionPrefix}${sessionId}`;
    const userSessionsKey = `${this.userSessionsPrefix}${userId}`;

    const sessionData: SessionData = {
      userId,
      email,
      ipAddress,
      userAgent,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    // Store session data
    await app.redis.setex(sessionKey, this.sessionTtl, JSON.stringify(sessionData));

    // Add session to user's session list
    await app.redis.sadd(userSessionsKey, sessionId);
    await app.redis.expire(userSessionsKey, this.sessionTtl);

    return sessionId;
  }

  /**
   * Get session data
   */
  async getSession(app: FastifyInstance, sessionId: string): Promise<SessionData | null> {
    const sessionKey = `${this.sessionPrefix}${sessionId}`;
    const sessionDataStr = await app.redis.get(sessionKey);

    if (!sessionDataStr) {
      return null;
    }

    const sessionData: SessionData = JSON.parse(sessionDataStr);
    return sessionData;
  }

  /**
   * Update session activity
   */
  async updateActivity(app: FastifyInstance, sessionId: string): Promise<void> {
    const sessionKey = `${this.sessionPrefix}${sessionId}`;
    const sessionDataStr = await app.redis.get(sessionKey);

    if (!sessionDataStr) {
      return;
    }

    const sessionData: SessionData = JSON.parse(sessionDataStr);
    sessionData.lastActivity = new Date();

    // Reset TTL on activity
    await app.redis.setex(sessionKey, this.sessionTtl, JSON.stringify(sessionData));
  }

  /**
   * Delete a session
   */
  async deleteSession(app: FastifyInstance, sessionId: string): Promise<void> {
    const sessionKey = `${this.sessionPrefix}${sessionId}`;
    const sessionDataStr = await app.redis.get(sessionKey);

    if (sessionDataStr) {
      const sessionData: SessionData = JSON.parse(sessionDataStr);
      const userSessionsKey = `${this.userSessionsPrefix}${sessionData.userId}`;

      // Remove from user's session list
      await app.redis.srem(userSessionsKey, sessionId);
    }

    // Delete session
    await app.redis.del(sessionKey);
  }

  /**
   * Delete all sessions for a user
   */
  async deleteAllUserSessions(app: FastifyInstance, userId: string): Promise<void> {
    const userSessionsKey = `${this.userSessionsPrefix}${userId}`;
    const sessionIds = await app.redis.smembers(userSessionsKey);

    if (sessionIds.length > 0) {
      // Delete all sessions
      const sessionKeys = sessionIds.map((id) => `${this.sessionPrefix}${id}`);
      await app.redis.del(...sessionKeys);
    }

    // Delete user sessions set
    await app.redis.del(userSessionsKey);
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(app: FastifyInstance, userId: string): Promise<SessionData[]> {
    const userSessionsKey = `${this.userSessionsPrefix}${userId}`;
    const sessionIds = await app.redis.smembers(userSessionsKey);

    if (sessionIds.length === 0) {
      return [];
    }

    const sessionKeys = sessionIds.map((id) => `${this.sessionPrefix}${id}`);
    const sessionsData = await app.redis.mget(...sessionKeys);

    const sessions: SessionData[] = [];
    for (const dataStr of sessionsData) {
      if (dataStr) {
        sessions.push(JSON.parse(dataStr));
      }
    }

    return sessions.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  /**
   * Revoke session by ID (for a specific user)
   */
  async revokeSession(app: FastifyInstance, userId: string, sessionId: string): Promise<void> {
    const sessionData = await this.getSession(app, sessionId);

    if (!sessionData || sessionData.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    await this.deleteSession(app, sessionId);
  }

  /**
   * Clean up expired sessions (can be run as a cron job)
   */
  async cleanupExpiredSessions(app: FastifyInstance): Promise<number> {
    // Redis automatically expires keys, but we can manually clean up orphaned session IDs
    // This is optional and can be run periodically
    let cleaned = 0;

    // Get all user session keys
    const pattern = `${this.userSessionsPrefix}*`;
    const keys = await app.redis.keys(pattern);

    for (const key of keys) {
      const sessionIds = await app.redis.smembers(key);
      const validSessions: string[] = [];

      for (const sessionId of sessionIds) {
        const sessionKey = `${this.sessionPrefix}${sessionId}`;
        const exists = await app.redis.exists(sessionKey);

        if (exists) {
          validSessions.push(sessionId);
        } else {
          cleaned++;
        }
      }

      // Update set with only valid sessions
      if (validSessions.length !== sessionIds.length) {
        await app.redis.del(key);
        if (validSessions.length > 0) {
          await app.redis.sadd(key, ...validSessions);
        }
      }
    }

    return cleaned;
  }
}

export const sessionManager = new SessionManager();

