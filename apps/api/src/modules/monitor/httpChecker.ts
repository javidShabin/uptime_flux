import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import https from "https";

export interface HttpCheckResult {
  status: "up" | "down";
  statusCode?: number;
  latency: number;
  error?: string;
  tlsInfo?: {
    valid: boolean;
    daysUntilExpiry?: number;
    issuer?: string;
  };
}

export interface HttpCheckOptions {
  url: string;
  timeoutMs: number;
  verifyTls?: boolean;
  expectedStatus?: string; // e.g., "200" or "200-399"
  tlsThresholdDays?: number;
}

/**
 * Check if a status code matches the expected status range
 */
function matchesExpectedStatus(statusCode: number, expectedStatus?: string): boolean {
  if (!expectedStatus) return true;

  // Single status code: "200"
  if (/^\d{3}$/.test(expectedStatus)) {
    return statusCode === parseInt(expectedStatus, 10);
  }

  // Status range: "200-399"
  const rangeMatch = expectedStatus.match(/^(\d{3})-(\d{3})$/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    return statusCode >= min && statusCode <= max;
  }

  return true;
}

/**
 * Get TLS certificate information
 */
async function getTlsInfo(url: string, timeoutMs: number): Promise<{
  valid: boolean;
  daysUntilExpiry?: number;
  issuer?: string;
}> {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const port = urlObj.port ? parseInt(urlObj.port, 10) : 443;
      const host = urlObj.hostname;

      const socket = https.connect(
        {
          host,
          port,
          rejectUnauthorized: false,
        },
        () => {
          const cert = socket.getPeerCertificate();
          socket.end();

          if (!cert || !cert.valid_to) {
            resolve({ valid: false });
            return;
          }

          const expiryDate = new Date(cert.valid_to);
          const now = new Date();
          const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          resolve({
            valid: daysUntilExpiry > 0,
            daysUntilExpiry,
            issuer: cert.issuer?.CN,
          });
        }
      );

      socket.setTimeout(timeoutMs, () => {
        socket.destroy();
        resolve({ valid: false });
      });

      socket.on("error", () => {
        resolve({ valid: false });
      });
    } catch (error) {
      resolve({ valid: false });
    }
  });
}

/**
 * Perform HTTP/HTTPS health check
 */
export async function checkHttp(options: HttpCheckOptions): Promise<HttpCheckResult> {
  const startTime = Date.now();

  try {
    const axiosConfig: AxiosRequestConfig = {
      method: "GET",
      url: options.url,
      timeout: options.timeoutMs,
      validateStatus: () => true, // Don't throw on any status code
      maxRedirects: 5,
    };

    // Configure TLS verification
    if (options.verifyTls === false) {
      axiosConfig.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
    }

    const response: AxiosResponse = await axios(axiosConfig);
    const latency = Date.now() - startTime;

    // Check if status code matches expected
    const statusMatches = matchesExpectedStatus(response.status, options.expectedStatus);

    // Get TLS info if HTTPS
    let tlsInfo: HttpCheckResult["tlsInfo"] | undefined;
    if (options.url.startsWith("https://") && options.tlsThresholdDays) {
      tlsInfo = await getTlsInfo(options.url, options.timeoutMs);
    }

    if (statusMatches && response.status >= 200 && response.status < 600) {
      return {
        status: "up",
        statusCode: response.status,
        latency,
        tlsInfo,
      };
    } else {
      return {
        status: "down",
        statusCode: response.status,
        latency,
        error: `Status code ${response.status} does not match expected status`,
        tlsInfo,
      };
    }
  } catch (error: any) {
    const latency = Date.now() - startTime;

    // Handle timeout
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return {
        status: "down",
        latency,
        error: "Request timeout",
      };
    }

    // Handle connection errors
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return {
        status: "down",
        latency,
        error: error.message || "Connection failed",
      };
    }

    // Handle TLS errors
    if (error.code === "CERT_HAS_EXPIRED" || error.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
      return {
        status: "down",
        latency,
        error: "TLS certificate error",
      };
    }

    return {
      status: "down",
      latency,
      error: error.message || "Unknown error",
    };
  }
}

