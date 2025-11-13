# 🚀 UptimeFlux API

> Fast and efficient REST API built with Fastify, MongoDB, and Redis for monitoring and uptime tracking.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Fastify](https://img.shields.io/badge/Fastify-5.6-black?logo=fastify)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19-green?logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-5.8-red?logo=redis)
![License](https://img.shields.io/badge/License-Private-red)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [License](#-license)

## ✨ Features

- ⚡ **Fast**: Built on Fastify for high performance
- 🔒 **Secure**: JWT authentication ready
- 📊 **Monitoring**: Health check endpoints
- 🔄 **Queue System**: BullMQ for background jobs
- 💾 **Database**: MongoDB with Mongoose ODM
- 🚀 **Cache**: Redis for caching and session management
- 🔥 **Hot Reload**: Development server with auto-reload

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Fastify](https://www.fastify.io/) |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| **Cache/Queue** | [Redis](https://redis.io/) + [ioredis](https://github.com/redis/ioredis) |
| **Job Queue** | [BullMQ](https://docs.bullmq.io/) |
| **Language** | TypeScript |
| **Runtime** | Node.js (ES Modules) |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v9 or higher)
- **MongoDB** instance (local or remote)
- **Redis** instance (local or remote)

## 🔧 Installation

### Clone the repository

```bash
git clone <repository-url>
cd UptimeFlux
```

### Install dependencies

```bash
# Install all dependencies from root
pnpm install

# Or install for API package only
cd apps/api
pnpm install
```

## ⚙️ Configuration

Create a `.env` file in the `apps/api` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/uptimeflux

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Environment Variables

#### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/uptimeflux` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |

#### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

## 🚀 Usage

### Development Mode

Start the development server with hot-reload:

```bash
# From root directory
pnpm --filter uptimeflux-api dev

# Or from apps/api directory
pnpm dev
```

The server will automatically restart on file changes.

### Production Mode

Build and start the production server:

```bash
# Build TypeScript
pnpm --filter uptimeflux-api build

# Start server
pnpm --filter uptimeflux-api start
```

### Docker (if available)

```bash
docker-compose up api
```

## 📡 API Endpoints

### Health Check

Check the server health status.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "env": "development",
  "redis": "ready"
}
```

**Example:**

```bash
curl http://localhost:3000/health
```

## 📁 Project Structure

```
apps/api/
├── src/
│   ├── config/              # Configuration files
│   │   ├── constants.ts     # Application constants
│   │   └── env.ts           # Environment validation (Zod)
│   ├── jobs/                # Background jobs
│   ├── modules/             # Feature modules
│   ├── plugins/             # Fastify plugins
│   │   ├── db.ts            # MongoDB connection plugin
│   │   ├── jwt.ts           # JWT authentication plugin
│   │   └── redis.ts         # Redis connection plugin
│   ├── routes/              # API route handlers
│   ├── utils/               # Utility functions
│   ├── workers/             # Queue workers (BullMQ)
│   └── main.ts              # Application entry point
├── Dockerfile               # Docker configuration
├── package.json             # Package dependencies
└── tsconfig.json            # TypeScript configuration
```

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot-reload |
| `pnpm build` | Build TypeScript to JavaScript |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint linter |

### Plugins

The API uses a plugin-based architecture:

- **MongoDB Plugin** (`plugins/db.ts`) - Handles MongoDB connection and lifecycle
- **Redis Plugin** (`plugins/redis.ts`) - Manages Redis connection, exposes `app.redis`
- **JWT Plugin** (`plugins/jwt.ts`) - JWT authentication (to be configured)

### Code Style

- TypeScript strict mode enabled
- ESLint for code linting
- ES Modules (ESM) for imports/exports

## 📝 License

This project is private and proprietary. All rights reserved.

---

**Made with ❤️ for UptimeFlux**
