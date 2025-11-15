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
- 🔒 **Secure**: OTP-based email verification for user registration
- 📧 **Email Verification**: Secure account creation with OTP codes
- 🔐 **JWT Authentication**: Token-based authentication with refresh tokens
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

# Database (replace with your actual MongoDB connection string)
MONGO_URL=mongodb://localhost:27017/your-database-name

# Redis (replace with your actual Redis connection string)
REDIS_URL=redis://localhost:6379

# Security (use a strong, random secret in production)
JWT_SECRET=replace-with-a-strong-random-secret-key
JWT_REFRESH_SECRET=replace-with-a-strong-random-refresh-secret-key
COOKIE_SECRET=replace-with-a-strong-random-cookie-secret-at-least-32-chars

# Token Configuration
REFRESH_TOKEN_TTL_DAYS=30

# OTP Configuration
OTP_EXPIRATION_MINUTES=10
OTP_RESEND_INTERVAL_SECONDS=60

# Email Configuration (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=UptimeFlux <noreply@uptimeflux.com>
```

> ⚠️ **Security Note**: Never commit `.env` files. Use strong, unique secrets in production.

### Environment Variables

#### Required

| Variable | Description | Example Format |
|----------|-------------|----------------|
| `MONGO_URL` | MongoDB connection string | `mongodb://[host]:[port]/[database]` |
| `REDIS_URL` | Redis connection string | `redis://[host]:[port]` |
| `JWT_SECRET` | Secret key for JWT signing | `strong-random-string` |
| `JWT_REFRESH_SECRET` | Secret key for JWT refresh tokens | `strong-random-string` |
| `COOKIE_SECRET` | Secret key for cookie signing (min 32 chars) | `strong-random-string-32-chars-min` |

#### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `REFRESH_TOKEN_TTL_DAYS` | Refresh token expiration in days | `30` |
| `OTP_EXPIRATION_MINUTES` | OTP code expiration time (1-30 min) | `10` |
| `OTP_RESEND_INTERVAL_SECONDS` | Minimum time between OTP resends (30-300 sec) | `60` |
| `SMTP_HOST` | SMTP server hostname | `""` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SECURE` | Use TLS/SSL for SMTP | `false` |
| `SMTP_USER` | SMTP username | `""` |
| `SMTP_PASS` | SMTP password | `""` |
| `SMTP_FROM` | Email sender address | `UptimeFlux <noreply@uptimeflux.com>` |

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

### Authentication

The API uses OTP-based email verification for secure user registration. Users must verify their email with a 6-digit OTP code before their account is created.

#### Register User

Register a new user account. This endpoint stores the user data temporarily and sends an OTP code to the provided email. The account is only created after OTP verification.

**Endpoint:** `POST /register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Password Requirements:**
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Response (201 Created):**

```json
{
  "message": "Verification code sent to email",
  "requiresVerification": true
}
```

**Error Responses:**
- `409 Conflict`: Account already exists or registration already in progress
- `500 Internal Server Error`: Failed to send verification email

**Example:**

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecureP@ssw0rd123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Verify OTP

Verify the OTP code sent to the user's email and create the account.

**Endpoint:** `POST /verify-otp`

**Request Body:**

```json
{
  "email": "user@example.com",
  "code": "123456",
  "type": "EMAIL_VERIFICATION"
}
```

**Response (200 OK):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Account created successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired OTP code
- `404 Not Found`: No pending registration found
- `409 Conflict`: Account already exists

**Example:**

```bash
curl -X POST http://localhost:3000/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "code": "123456",
    "type": "EMAIL_VERIFICATION"
  }'
```

**Registration Flow:**

1. **Step 1**: User calls `POST /register` with their details
   - System generates a 6-digit OTP code
   - User data is stored in `PendingRegistration` collection
   - OTP is sent to the user's email
   - OTP expires after the configured time (default: 10 minutes)

2. **Step 2**: User calls `POST /verify-otp` with the OTP code
   - System verifies the OTP code
   - If valid, user account is created in `User` collection
   - Pending registration is deleted
   - User can now log in

**Important Notes:**
- Pending registrations are automatically deleted when OTP expires
- If email sending fails, the pending registration is automatically cleaned up
- Each email can only have one pending registration at a time
- OTP codes are hashed before storage for security

### Test Job

Enqueue a test monitoring job to the worker queue.

**Endpoint:** `POST /test-job`

**Response:**

```json
{
  "ok": true
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/test-job
```

This endpoint adds a test job to the `monitor-run` queue with the following data:
- `monitorId`: "123"
- `url`: "https://google.com"
- `timeout`: 5000

The worker will process this job and perform an HTTP GET request to the specified URL.

## 📁 Project Structure

```
apps/api/
├── src/
│   ├── config/              # Configuration files
│   │   ├── constants.ts     # Application constants
│   │   └── env.ts           # Environment validation (Zod)
│   ├── jobs/                # Background jobs
│   ├── modules/             # Feature modules
│   │   └── authentication/  # Authentication module
│   │       ├── auth.controller.ts      # Request handlers
│   │       ├── auth.service.ts          # Business logic
│   │       ├── auth.model.ts            # User model
│   │       ├── auth.routes.ts           # Route definitions
│   │       ├── auth.schemas.ts          # Request validation schemas
│   │       ├── auth.errors.ts           # Custom error classes
│   │       ├── otp.model.ts             # OTP model
│   │       ├── pending-registration.model.ts  # Pending registration model
│   │       └── email.service.ts        # Email service
│   ├── plugins/             # Fastify plugins
│   │   ├── db.ts            # MongoDB connection plugin
│   │   ├── jwt.ts           # JWT authentication plugin
│   │   └── redis.ts         # Redis connection plugin
│   ├── queues/              # BullMQ queue definitions
│   │   └── index.ts         # Monitor queue setup
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
- **JWT Plugin** (`plugins/jwt.ts`) - JWT authentication with access and refresh tokens

### Authentication Module

The authentication module provides secure user registration with OTP-based email verification:

- **Registration Flow**: Two-step process (register → verify OTP)
- **Data Models**:
  - `User` - Active user accounts
  - `PendingRegistration` - Temporary storage for unverified signups
  - `Otp` - OTP code management
- **Security Features**:
  - Password hashing with bcrypt
  - OTP codes hashed before storage
  - Automatic cleanup of expired pending registrations
  - Email verification required before account creation

### Code Style

- TypeScript strict mode enabled
- ESLint for code linting
- ES Modules (ESM) for imports/exports

## 📝 License

This project is private and proprietary. All rights reserved.

---

**Made with ❤️ for UptimeFlux**
