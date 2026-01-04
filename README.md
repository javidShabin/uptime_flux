# UptimeFlux - Uptime Monitoring SaaS


[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D4.9-blue.svg)](https://www.typescriptlang.org/)

A production-ready uptime monitoring SaaS MVP built with modern technologies. 
UptimeFlux focuses on real backend aggregation, incident tracking, and a dashboard powered by real monitoring data (no mock or fake metrics).
## 🚀 Implemented Features (MVP)

- **Uptime Monitoring**: Create and manage uptime monitors
- **Background Health Checks**: Automated checks via worker service
- **Incident Management**: Automatic incident creation and resolution
- **Real Dashboard Metrics**: Backend-driven response time, uptime, and incident graphs
- **Authentication & Ownership**: JWT auth with user-scoped data access

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Document database for storing data
- **Redis** - In-memory data structure store for caching and queues
- **BullMQ** - Advanced queue system for background jobs

### Frontend
- **React** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive data visualization
- **Vite** - Fast build tool

### Architecture
- **Monorepo** - Managed with pnpm and Turbo
- **Shared Package** - Cross-service models and types
- **Worker Service** - Background job processing for monitoring checks

## 📁 Project Structure

```
uptimeflux/
├── apps/
│   ├── api/          # Express.js backend API
│   ├── web/          # React frontend dashboard
│   └── worker/       # BullMQ worker for monitoring checks
├── packages/
│   ├── shared/       # Shared models, types, and services
│   ├── ui/           # Reusable UI components
│   └── eslint-config # ESLint configurations
├── docker-compose.yml
├── package.json
└── pnpm-workspace.yaml
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker & Docker Compose
- MongoDB (local or remote)
- Redis (local or remote)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/uptimeflux.git
cd uptimeflux
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Copy the example environment files and configure your settings:

```bash
# For API
cp apps/api/.env.example apps/api/.env

# For Worker
cp apps/worker/.env.example apps/worker/.env
```

4. **Start services with Docker**

```bash
docker-compose up -d
```

5. **Start the development servers**

```bash
pnpm dev
```

### Environment Variables

#### API Service (apps/api/.env)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/uptimeflux
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

#### Worker Service (apps/worker/.env)

```env
MONGODB_URI=mongodb://localhost:27017/uptimeflux
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📋 API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login to an account
- `POST /auth/logout` - Logout from account

### Monitors

- `GET /monitors/get` - Get all monitors for the user
- `POST /monitors/create` - Create a new monitor
- `PATCH /monitors/update/:id` - Update an existing monitor
- `DELETE /monitors/remove/:id` - Delete a monitor

### Dashboard

- `GET /dashboard/summary` - Get dashboard summary
- `GET /dashboard/graph-summary` - Get dashboard graph data

### Incidents

- `GET /incidents` - Get all incidents (with filters)
- `GET /incidents/:id` - Get incident by ID

## 📊 Dashboard Features

The dashboard provides comprehensive monitoring insights:

- **Response Time Graph**: Visualize response times over the last 24 hours
- **Uptime Graph**: Track uptime percentage over the last 7 days
- **Incidents Graph**: Monitor incident frequency over the last 7 days
- **Monitor Status**: Real-time status of all your services
- **Recent Incidents**: Timeline of recent service incidents
- **Statistics**: Key metrics at a glance

## 🚀 Deployment

### Docker Deployment

The project includes a `docker-compose.yml` file for easy containerized deployment:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: uptimeflux-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:alpine
    container_name: uptimeflux-redis
    ports:
      - "6379:6379"

  api:
    build: ./apps/api
    container_name: uptimeflux-api
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/uptimeflux
      - REDIS_HOST=redis
    depends_on:
      - mongodb
      - redis

  worker:
    build: ./apps/worker
    container_name: uptimeflux-worker
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/uptimeflux
      - REDIS_HOST=redis
    depends_on:
      - mongodb
      - redis

volumes:
  mongo_data:
```

### Production Deployment

For production deployment, consider:

1. **Environment Configuration**: Set up environment variables for production
2. **Database**: Use managed MongoDB service (Atlas, etc.)
3. **Redis**: Use managed Redis service (AWS ElastiCache, etc.)
4. **Load Balancer**: Use a load balancer for multiple instances
5. **Monitoring**: Set up monitoring for the monitoring service

## 🧪 Testing

Run tests for all services:

```bash
pnpm test
```

Run tests for a specific service:

```bash
# API tests
cd apps/api && pnpm test

# Web tests
cd apps/web && pnpm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐳 Docker Compose

The project includes a `docker-compose.yml` file that sets up all required services:

- MongoDB for data persistence
- Redis for caching and queues
- The API server
- The worker service

To start all services:

```bash
docker-compose up -d
```

## ⚙️ Configuration

The project uses a monorepo structure managed by pnpm and Turbo. Each service has its own configuration:

- **API Service**: Express.js server with MongoDB and Redis integration
- **Worker Service**: BullMQ-based worker for background monitoring checks
- **Web Service**: React dashboard with TypeScript and Tailwind CSS

## 📈 Monitoring Capabilities

UptimeFlux provides comprehensive monitoring features:

- HTTP/HTTPS endpoint monitoring
- Response time tracking
- Status code validation
- SSL certificate monitoring
- Custom check intervals
- Incident detection and notification
- Historical data analysis
- Real-time dashboard visualization

## 🎯 MVP Features

This version of UptimeFlux includes the core functionality for a complete uptime monitoring solution:

- User authentication and authorization
- Monitor creation and management
- Real-time status checking
- Incident tracking
- Dashboard with graphs and statistics
- Email notifications (via shared alert service)
- Historical data visualization
- Responsive web interface