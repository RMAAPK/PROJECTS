# Multi-stage Dockerfile for RMAA AI Platform (Render Deployment)
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app/Website

# Copy dependencies manifest
COPY Website/package*.json ./
RUN npm ci

# Copy full website source and compile production bundle
COPY Website/ ./
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000

# Install production dependencies for Website
WORKDIR /app/Website
COPY Website/package*.json ./
RUN npm ci --only=production

# Install production dependencies for Private AI
WORKDIR /app/Private/whatsapp-bot
COPY Private/whatsapp-bot/package*.json ./
RUN npm ci --only=production

# Copy Private AI source
COPY Private /app/Private

# Copy compiled frontend and production server
WORKDIR /app/Website
COPY --from=builder /app/Website/dist ./dist
COPY Website/server.js ./server.js
COPY Website/src/data ./src/data

EXPOSE 10000

# Health check matching Render spec
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/healthz || exit 1

CMD ["node", "server.js"]
