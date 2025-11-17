// @ts-expect-error - socket.io types may not be available
import { Server } from "socket.io";
// @ts-expect-error - @socket.io/redis-adapter types may not be available
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { env } from "../../config/env.js";
import type { FastifyInstance } from "fastify";
import type { RealtimeMessage } from "./types.js";

let io: any = null;
let redisPub: any = null;
let redisSub: any = null;

export async function createSocketServer(app: FastifyInstance): Promise<any> {
  if (io) {
    return io;
  }

  // Create Redis clients for pub/sub
  // @ts-expect-error - ioredis default export type issue with NodeNext module resolution
  redisPub = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 5,
    retryStrategy(times: number) {
      return Math.min(times * 50, 2000);
    },
  });

  redisSub = redisPub.duplicate();

  // Create Socket.IO server
  io = new Server(app.server, {
    cors: {
      origin: env.NODE_ENV === "production" ? false : true, // Configure allowed origins in production
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Use Redis adapter for horizontal scaling
  io.adapter(createAdapter(redisPub, redisSub));

  // Subscribe to Redis pub/sub for worker events
  redisSub.psubscribe("ws:project:*", (err: Error | null) => {
    if (err) {
      app.log.error(err, "Failed to subscribe to Redis pattern");
    } else {
      app.log.info("📡 Subscribed to Redis pattern: ws:project:*");
    }
  });

  // Handle messages from Redis pub/sub
  redisSub.on("pmessage", (pattern: string, channel: string, message: string) => {
    try {
      const parsed: RealtimeMessage = JSON.parse(message);
      const projectId = channel.replace("ws:project:", "");
      
      if (projectId) {
        emitToProject(projectId, parsed.event, parsed.data);
      }
    } catch (error) {
      app.log.error(error, `Failed to parse Redis message from ${channel}`);
    }
  });

  // Handle client connections
  io.on("connection", (socket: any) => {
    app.log.info(`Socket client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      app.log.info(`Socket client disconnected: ${socket.id}`);
    });
  });

  app.log.info("🔌 Socket.IO server initialized with Redis adapter");

  return io;
}

export function emitToProject(projectId: string, event: string, data: any): void {
  if (!io) {
    return;
  }

  const namespace = `/project:${projectId}`;
  io.to(namespace).emit(event, data);
}

export const realtime = {
  get io() {
    return io;
  },
  emitToProject,
};

