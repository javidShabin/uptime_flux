import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export interface PingCheckResult {
  status: "up" | "down";
  latency: number;
  error?: string;
  packetLoss?: number;
}

export interface PingCheckOptions {
  host: string;
  timeoutMs: number;
  count?: number; // Number of ping packets to send (default: 1)
}

/**
 * Parse ping output to extract latency and packet loss
 * Handles both Windows and Unix/Linux ping command formats
 */
function parsePingOutput(output: string, platform: string): { latency: number; packetLoss?: number } | null {
  if (platform === "win32") {
    // Windows ping format: "Reply from 8.8.8.8: bytes=32 time=15ms TTL=118"
    // Or: "Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)"
    const timeMatch = output.match(/time[<=](\d+)\s*ms/i);
    const packetLossMatch = output.match(/Lost\s*=\s*(\d+)\s*\((\d+)%\s*loss\)/i);
    
    if (timeMatch) {
      const latency = parseInt(timeMatch[1], 10);
      let packetLoss: number | undefined;
      
      if (packetLossMatch) {
        packetLoss = parseInt(packetLossMatch[2], 10);
      }
      
      return { latency, packetLoss };
    }
  } else {
    // Unix/Linux ping format: "64 bytes from 8.8.8.8: icmp_seq=0 ttl=118 time=15.234 ms"
    // Or: "4 packets transmitted, 4 received, 0% packet loss"
    const timeMatch = output.match(/time=([\d.]+)\s*ms/i);
    const packetLossMatch = output.match(/(\d+)%\s*packet\s*loss/i);
    
    if (timeMatch) {
      const latency = Math.round(parseFloat(timeMatch[1]));
      let packetLoss: number | undefined;
      
      if (packetLossMatch) {
        packetLoss = parseInt(packetLossMatch[1], 10);
      }
      
      return { latency, packetLoss };
    }
  }
  
  return null;
}

/**
 * Build ping command based on platform
 */
function buildPingCommand(host: string, count: number, timeoutMs: number, platform: string): string {
  if (platform === "win32") {
    // Windows: ping -n <count> -w <timeout_ms> <host>
    return `ping -n ${count} -w ${timeoutMs} ${host}`;
  } else {
    // Unix/Linux: ping -c <count> -W <timeout_sec> <host>
    const timeoutSec = Math.max(1, Math.ceil(timeoutMs / 1000));
    return `ping -c ${count} -W ${timeoutSec} ${host}`;
  }
}

/**
 * Perform ICMP ping health check
 * Uses the system's native ping command for cross-platform compatibility
 */
export async function checkPing(options: PingCheckOptions): Promise<PingCheckResult> {
  const startTime = Date.now();
  const platform = os.platform();
  const count = options.count || 1;
  
  // Validate host (basic check to prevent command injection)
  if (!/^[a-zA-Z0-9.-]+$/.test(options.host) && !/^[a-fA-F0-9:]+$/.test(options.host)) {
    // Allow IPv6 addresses (simplified check)
    return {
      status: "down",
      latency: Date.now() - startTime,
      error: "Invalid host format",
    };
  }

  try {
    const command = buildPingCommand(options.host, count, options.timeoutMs, platform);
    
    // Execute ping command with timeout
    const { stdout, stderr } = await Promise.race([
      execAsync(command, {
        timeout: options.timeoutMs + 1000, // Add 1 second buffer
        maxBuffer: 1024 * 1024, // 1MB buffer
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Ping timeout")), options.timeoutMs + 1000);
      }),
    ]);

    const output = stdout || stderr || "";
    const parseResult = parsePingOutput(output, platform);

    // Check if ping was successful
    // Success indicators:
    // - Windows: "Reply from" or "Packets: Sent = X, Received = X"
    // - Unix/Linux: "bytes from" or "X packets transmitted, X received"
    const isSuccess = 
      (platform === "win32" && (output.includes("Reply from") || /Received\s*=\s*\d+/i.test(output))) ||
      (platform !== "win32" && (output.includes("bytes from") || /\d+\s+packets\s+transmitted.*\d+\s+received/i.test(output)));

    if (isSuccess && parseResult) {
      return {
        status: "up",
        latency: parseResult.latency,
        packetLoss: parseResult.packetLoss,
      };
    } else {
      // Ping failed but command executed
      return {
        status: "down",
        latency: Date.now() - startTime,
        error: "Host unreachable or no response",
        packetLoss: parseResult?.packetLoss,
      };
    }
  } catch (error: any) {
    const latency = Date.now() - startTime;
    
    // Handle timeout
    if (error.message?.includes("timeout") || error.code === "ETIMEDOUT") {
      return {
        status: "down",
        latency,
        error: "Ping timeout",
      };
    }

    // Handle command not found
    if (error.code === "ENOENT" || error.message?.includes("spawn ping")) {
      return {
        status: "down",
        latency,
        error: "Ping command not available on this system",
      };
    }

    // Handle other errors
    return {
      status: "down",
      latency,
      error: error.message || "Ping failed",
    };
  }
}

/**
 * Parse ping target (hostname or IP address)
 * For ping, the target is just a hostname or IP address
 */
export function parsePingTarget(target: string): string | null {
  // Remove any protocol prefixes if present
  const cleaned = target.replace(/^(https?|tcp|ping):\/\//i, "").trim();
  
  // Basic validation for hostname or IP
  // Allow: hostname, domain.com, 192.168.1.1, 2001:db8::1
  if (!cleaned || cleaned.length === 0 || cleaned.length > 253) {
    return null;
  }

  // Check for valid characters (hostname, IPv4, or IPv6)
  if (/^[a-zA-Z0-9.-]+$/.test(cleaned) || /^[a-fA-F0-9:]+$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

