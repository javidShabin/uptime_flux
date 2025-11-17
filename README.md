# 🚀 UptimeFlux

> A modern monorepo application for uptime monitoring and tracking, built with TypeScript, Fastify, React, and Redis.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![pnpm](https://img.shields.io/badge/pnpm-9.12-orange?logo=pnpm)
![Turbo](https://img.shields.io/badge/Turbo-2.1-black?logo=turbo)
![License](https://img.shields.io/badge/License-Private-red)

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Docker](#-docker)
- [Scripts](#-scripts)
- [License](#-license)

## 🎯 Overview

UptimeFlux is a comprehensive uptime monitoring solution built as a monorepo, consisting of:

- **API** - Fast REST API built with Fastify (Port 3000) with full CRUD operations for monitors
- **Web** - Modern React frontend with Vite (Port 5173)
- **Worker** - Background job processor with BullMQ for monitoring tasks
- **Shared Packages** - Reusable TypeScript packages

### Key Features

- 🔐 **Secure Authentication** - OTP-based email verification
- 🛡️ **Security** - Helmet headers, CORS protection, and rate limiting
- 📊 **Uptime Monitoring** - Multi-protocol monitoring (HTTP/HTTPS/TCP)
- 🔔 **TLS Monitoring** - Automatic SSL/TLS certificate expiration tracking
- 🏷️ **Organization** - Tag-based monitor organization
- ⏸️ **Control** - Pause/resume monitors on demand
- 📈 **Scalable** - Queue-based architecture for high throughput
- 🎯 **Error Handling** - Global error handler with standardized responses

## 🏗 Architecture

```
┌─────────────┐
│     Web     │  React + Vite (Port 5173)
│  (Frontend) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     API     │  Fastify (Port 3000)
│  (Backend)  │
└──────┬──────┘
       │
       ├──────────┐
       ▼          ▼
┌──────────┐  ┌──────────┐
│ MongoDB  │  │  Redis   │
│          │  │          │
└──────────┘  └────┬─────┘
                   │
                   ▼
            ┌──────────┐
            │  Worker  │  BullMQ Jobs
            │          │
            └──────────┘
```

## 🛠 Tech Stack

### Backend
- **Framework**: [Fastify](https://www.fastify.io/) - High performance web framework
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Cache/Queue**: [Redis](https://redis.io/) with [ioredis](https://github.com/redis/ioredis)
- **Job Queue**: [BullMQ](https://docs.bullmq.io/)

### Frontend
- **Framework**: [React](https://react.dev/) 19
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### Infrastructure
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v9.12 or higher)
- **Docker** & **Docker Compose** (optional, for containerized setup)
- **MongoDB** (if not using Docker)
- **Redis** (if not using Docker)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd UptimeFlux
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create `.env` files for each app. See the individual app README files for required environment variables:

- **API**: See `apps/api/README.md` for environment variable requirements
- **Web**: See `apps/web/README.md` for environment variable requirements
- **Worker**: See `apps/worker/README.md` for environment variable requirements (requires `REDIS_URL`)

> ⚠️ **Important**: Never commit `.env` files to version control. Use `.env.example` files as templates.

### 4. Start development servers

```bash
# Start all services
pnpm dev

# Or start specific services
pnpm --filter uptimeflux-api dev
pnpm --filter web dev
pnpm --filter worker dev
```

## 📁 Project Structure

```
UptimeFlux/
├── apps/
│   ├── api/              # Fastify REST API
│   │   ├── src/
│   │   │   ├── config/   # Configuration
│   │   │   ├── modules/  # Feature modules
│   │   │   │   ├── authentication/  # Auth module
│   │   │   │   ├── profile/         # Profile module
│   │   │   │   └── monitor/         # Monitor module
│   │   │   ├── plugins/  # Fastify plugins
│   │   │   ├── queues/   # BullMQ queues
│   │   │   ├── workers/  # Queue workers
│   │   │   └── main.ts   # Entry point
│   │   └── README.md
│   ├── web/              # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── main.tsx
│   │   └── README.md
│   ├── worker/           # Background job processor
│   │   ├── src/
│   │   │   ├── queues/   # BullMQ queue definitions
│   │   │   ├── processors/  # Job processors
│   │   │   ├── utils/    # Utility functions
│   │   │   └── main.ts   # Worker entry point
│   │   └── README.md
│   └── docs/             # Documentation
├── packages/
│   ├── config/           # Shared config (ESLint, TypeScript)
│   ├── types/            # Shared TypeScript types
│   └── ui/               # Shared UI components
├── infra/                # Infrastructure scripts
│   ├── scripts/
│   │   ├── migrate.ts    # Database migrations
│   │   └── seed.ts       # Database seeding
│   └── README.md
├── docker-compose.yml    # Docker services
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspace config
└── package.json          # Root package.json
```

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all apps and packages |

### App-Specific Commands

```bash
# API
pnpm --filter uptimeflux-api dev
pnpm --filter uptimeflux-api build

# Web
pnpm --filter web dev
pnpm --filter web build

# Worker
pnpm --filter worker dev
pnpm --filter worker build
```

## 🐳 Docker

### Start all services with Docker Compose

```bash
docker-compose up
```

This will start:
- **API** on `http://localhost:3000`
- **Web** on `http://localhost:5173`
- **Worker** (background service)
- **Redis** on `localhost:6379`

### Individual services

```bash
# Start only specific services
docker-compose up api web redis

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f api
```

## 📡 API Endpoints

### Health Check

Check the server health status.

**Endpoint:** `GET /health`

**Example:**

```bash
curl http://localhost:3000/health
```

### Authentication

The API uses OTP-based email verification for user registration.

**Registration Flow:**
1. User submits signup details → OTP is generated and sent to email
2. User verifies OTP → Account is created

**Endpoints:**
- `POST /auth/register` - Register a new user (requires OTP verification)
- `POST /auth/verify-otp` - Verify OTP and create account
- `POST /auth/login` - Login and get access tokens
- `POST /auth/refresh` - Refresh access token

For detailed authentication documentation, see [API README](apps/api/README.md).

### Monitors

Comprehensive uptime monitoring with multi-protocol support.

**Endpoints:**
- `GET /monitors` - List monitors with pagination and filters
- `GET /monitors/:id` - Get monitor by ID
- `POST /monitors` - Create new monitor
- `PUT /monitors/:id` - Update monitor
- `DELETE /monitors/:id` - Delete monitor
- `PATCH /monitors/:id/pause` - Toggle pause status

**Monitor Types:**
- `http` - HTTP monitoring
- `https` - HTTPS monitoring with TLS validation
- `tcp` - TCP port connectivity check
- `ping` - ICMP ping (future)

**Features:**
- User-scoped monitors (automatic ownership validation)
- Configurable check intervals (min: 30 seconds)
- Custom timeout settings (1-60 seconds)
- Status code validation (single or range)
- TLS certificate expiration monitoring
- Tag-based organization
- Pause/resume functionality
- Project/workspace grouping

**Example - Create Monitor:**

```bash
curl -X POST http://localhost:3000/monitors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Website",
    "type": "https",
    "target": "https://example.com",
    "scheduleSec": 300,
    "timeoutMs": 5000
  }'
```

For detailed monitor documentation, see [API README](apps/api/README.md#monitors).

### Test Job

> ⚠️ **Development Only**: This endpoint is only available when `NODE_ENV=development`.

Enqueue a test monitoring job to the worker queue.

**Endpoint:** `POST /test-job`

**Example:**

```bash
curl -X POST http://localhost:3000/test-job
```

This endpoint adds a test job to the `monitor-run` queue. The worker will process it and perform an HTTP health check.

**Note**: This endpoint is automatically disabled in production for security reasons.

For more details, see [API README](apps/api/README.md).

## 🔧 Configuration

### Turborepo

The project uses [Turborepo](https://turbo.build/) for monorepo management. Configuration is in `turbo.json`.

### Workspaces

Workspaces are configured in `pnpm-workspace.yaml`:
- `apps/*` - Applications
- `packages/*` - Shared packages

## 📝 License

This project is private and proprietary. All rights reserved.

---

**Made with ❤️ for UptimeFlux**

