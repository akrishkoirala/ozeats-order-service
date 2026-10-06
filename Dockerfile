# Stage 1: Build the TypeScript application
FROM node:24-alpine AS builder

WORKDIR /app

# Install all dependencies needed for building
COPY package*.json ./
RUN npm ci

# Copy TypeScript configuration and source code
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript into JavaScript
RUN npm run build


# Stage 2: Production image
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled application from builder stage
COPY --from=builder /app/dist/src ./dist/src

# Run as the non-root Node user for better security
USER node

EXPOSE 3000

CMD ["node", "dist/src/server.js"]