# 🔧 UptimeFlux Worker

> Background job processor built with BullMQ for handling monitoring tasks and HTTP health checks.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![BullMQ](https://img.shields.io/badge/BullMQ-5.63-orange?logo=redis)
![License](https://img.shields.io/badge/License-Private-red)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [License](#-license)

## 🎯 Overview

The Worker service processes background jobs from the BullMQ queue system. It handles monitoring tasks such as:
- HTTP health checks
- URL availability monitoring
- Response time measurement
- Status code validation

## ✨ Features

- ⚡ **Fast**: Built with BullMQ for efficient job processing
- 🔄 **Reliable**: Automatic retry with exponential backoff
- 📊 **Concurrent**: Processes multiple jobs simultaneously (configurable concurrency)
- 🚨 **Error Handling**: Comprehensive error handling and logging
- 🔥 **Hot Reload**: Development server with auto-reload

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Job Queue** | [BullMQ](https://docs.bullmq.io/) |
| **Redis Client** | [ioredis](https://github.com/redis/ioredis) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Language** | TypeScript |
| **Runtime** | Node.js (ES Modules) |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v9 or higher)
- **Redis** instance (local or remote) - Required for BullMQ

## 🔧 Installation

### Install dependencies

```bash
# Install all dependencies from root
pnpm install

# Or install for worker package only
cd apps/worker
pnpm install
```

## ⚙️ Configuration

Create a `.env` file in the `apps/worker` directory:

```env
# Redis Connection (required)
REDIS_URL=redis://localhost:6379
```

> ⚠️ **Important**: The Redis connection must have `maxRetriesPerRequest: null` when using BullMQ. This is automatically configured in the worker code.

### Environment Variables

#### Required

| Variable | Description | Example Format |
|----------|-------------|----------------|
| `REDIS_URL` | Redis connection string | `redis://[host]:[port]` |

## 🚀 Usage

### Development Mode

Start the worker with hot-reload:

```bash
# From root directory
pnpm --filter worker dev

# Or from apps/worker directory
pnpm dev
```

The worker will automatically restart on file changes.

### Production Mode

Build and start the production worker:

```bash
# Build TypeScript
pnpm --filter worker build

# Start worker
pnpm --filter worker start
```

### Docker

```bash
# Start worker with Docker Compose
docker-compose up worker

# Or start all services
docker-compose up
```

## 📁 Project Structure

```
apps/worker/
├── src/
│   ├── processors/          # Job processors
│   │   ├── monitor.processor.ts  # Monitor job processor
│   │   └── index.ts
│   ├── queues/              # Queue definitions
│   │   ├── monitor.queue.ts # Monitor queue configuration
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── httpClient.ts    # HTTP client utilities
│   └── main.ts              # Worker entry point
├── Dockerfile               # Docker configuration
├── package.json             # Package dependencies
└── tsconfig.json            # TypeScript configuration
```

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start worker in development mode with hot-reload |
| `pnpm build` | Build TypeScript to JavaScript |
| `pnpm start` | Start production worker |

### Queue Configuration

The worker listens to the `monitor-run` queue and processes jobs with the following structure:

```typescript
{
  monitorId: string;
  url: string;
  timeout?: number; // Default: 5000ms
}
```

### Job Processor

The `monitorProcessor` function:
1. Performs an HTTP GET request to the specified URL
2. Measures response time (latency)
3. Returns status information:
   - **Success**: `{ monitorId, status: "up", statusCode, latency }`
   - **Failure**: `{ monitorId, status: "down", error, latency }`

### Worker Configuration

- **Queue Name**: `monitor-run`
- **Concurrency**: 5 jobs simultaneously
- **Retry Strategy**: Configured in queue options (3 attempts with exponential backoff)

## 🧪 Testing

### Test the Worker

1. **Start Redis**:
   ```bash
   docker-compose up redis
   # Or use your local Redis instance
   ```

2. **Start the Worker**:
   ```bash
   pnpm --filter worker dev
   ```

3. **Enqueue a Test Job** (from the API):
   ```bash
   curl -X POST http://localhost:3000/test-job
   ```

4. **Check Worker Logs**:
   You should see output like:
   ```
   🚀 Worker started. Listening for monitor-run jobs...
   📌 Processing job: <job-id>
   ✅ Completed job: <job-id> { monitorId: '123', status: 'up', statusCode: 200, latency: 123 }
   🎉 Job <job-id> completed
   ```

### Queue Name Requirements

⚠️ **Important**: BullMQ queue names cannot contain colons (`:`). Use hyphens (`-`) or underscores (`_`) instead.

Example:
- ✅ `monitor-run`
- ❌ `monitor:run`

### Redis Connection Requirements

When using IORedis directly with BullMQ, you must set `maxRetriesPerRequest: null`:

```typescript
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
```

This is already configured in the worker code.

## 📝 License

This project is private and proprietary. All rights reserved.

---

**Made with ❤️ for UptimeFlux**

