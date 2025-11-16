import net from "net";

export interface TcpCheckResult {
  status: "up" | "down";
  latency: number;
  error?: string;
}

export interface TcpCheckOptions {
  host: string;
  port: number;
  timeoutMs: number;
}

/**
 * Perform TCP health check
 */
export async function checkTcp(options: TcpCheckOptions): Promise<TcpCheckResult> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const socket = new net.Socket();

    // Set timeout
    socket.setTimeout(options.timeoutMs);

    // Handle connection success
    socket.on("connect", () => {
      const latency = Date.now() - startTime;
      socket.destroy();
      resolve({
        status: "up",
        latency,
      });
    });

    // Handle timeout
    socket.on("timeout", () => {
      const latency = Date.now() - startTime;
      socket.destroy();
      resolve({
        status: "down",
        latency,
        error: "Connection timeout",
      });
    });

    // Handle connection errors
    socket.on("error", (error: NodeJS.ErrnoException) => {
      const latency = Date.now() - startTime;
      socket.destroy();

      let errorMessage = "Connection failed";

      if (error.code === "ECONNREFUSED") {
        errorMessage = "Connection refused";
      } else if (error.code === "ETIMEDOUT") {
        errorMessage = "Connection timeout";
      } else if (error.code === "ENOTFOUND") {
        errorMessage = "Host not found";
      } else if (error.code === "EHOSTUNREACH") {
        errorMessage = "Host unreachable";
      } else if (error.message) {
        errorMessage = error.message;
      }

      resolve({
        status: "down",
        latency,
        error: errorMessage,
      });
    });

    // Attempt connection
    socket.connect(options.port, options.host);
  });
}

/**
 * Parse host:port string into host and port
 */
export function parseTcpTarget(target: string): { host: string; port: number } | null {
  // Format: host:port or host:port:protocol
  const parts = target.split(":");

  if (parts.length < 2) {
    return null;
  }

  const host = parts[0];
  const port = parseInt(parts[1], 10);

  if (isNaN(port) || port < 1 || port > 65535) {
    return null;
  }

  return { host, port };
}

