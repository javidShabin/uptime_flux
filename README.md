# Uptime Monitoring SaaS

Production-grade uptime monitoring platform built with a Turborepo monorepo.

This repository is under active development.

## Monorepo Structure

### Apps
- `web` – Next.js frontend
- `api` – Express API (TypeScript)
- `worker` – BullMQ background worker

### Packages
- `shared` – Shared types and contracts (no runtime code)
- `ui` – Shared UI components
- `eslint-config` – Shared ESLint configuration
- `typescript-config` – Shared TypeScript configs

## Tech Stack
- Turborepo
- pnpm workspaces
- TypeScript
- Next.js
- Express
- BullMQ + Redis

## Local Development

Install dependencies:

```bash
pnpm install
