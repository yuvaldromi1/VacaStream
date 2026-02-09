# VacaStream

> Vacation viewing system with Like/Unlike functionality.

## Architecture

- **pnpm monorepo** with workspace catalogs
- **Express v5 microservices** (Gateway → Auth + Vacation)
- **React + TypeScript** frontend
- **MySQL** database

## Quick Start

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Start all services (Gateway:3000, Auth:3001, Vacation:3002, Frontend:5173)
pnpm dev
```

## Project Structure

| Package | Description | Port |
|---------|-------------|------|
| `Backend/Gateway` | API Gateway — proxy + JWT verification | 3000 |
| `Backend/Auth` | Authentication microservice | 3001 |
| `Backend/Vacation` | Vacations, Likes, Reports microservice | 3002 |
| `Frontend/web-app` | React SPA | 5173 |
| `Libraries/@YD/jwt` | JWT helper library | — |
| `Libraries/@YD/restify` | REST response helpers + error classes | — |

## Environment Variables

Copy `.env.example` files in each Backend service and fill in your values:

```bash
cp Backend/Auth/.env.example Backend/Auth/.env
cp Backend/Vacation/.env.example Backend/Vacation/.env
cp Backend/Gateway/.env.example Backend/Gateway/.env
```

## Author

**Yuval Dromi** — Full Stack Web Developer Course Project
