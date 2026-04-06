# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/db/package.json packages/db/
COPY packages/serving/package.json packages/serving/
COPY packages/ingestion/package.json packages/ingestion/
COPY packages/mcp/package.json packages/mcp/
COPY packages/dashboard/package.json packages/dashboard/
RUN pnpm install --frozen-lockfile

# Stage 2: Build dashboard
FROM deps AS build-dashboard
COPY packages/dashboard/ packages/dashboard/
COPY tsconfig.base.json ./
RUN pnpm --filter @cortex/dashboard run build

# Stage 3: Build TypeScript packages
FROM deps AS build-ts
COPY packages/ packages/
COPY tsconfig.base.json ./
RUN pnpm --filter @cortex/db run build
RUN pnpm --filter @cortex/serving run build
RUN pnpm --filter @cortex/ingestion run build
RUN pnpm --filter @cortex/mcp run build

# Stage 4: Production image
FROM node:22-alpine AS production
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=build-ts /app/packages/db/dist ./packages/db/dist
COPY --from=build-ts /app/packages/db/package.json ./packages/db/
COPY --from=build-ts /app/packages/serving/dist ./packages/serving/dist
COPY --from=build-ts /app/packages/serving/package.json ./packages/serving/
COPY --from=build-ts /app/packages/ingestion/dist ./packages/ingestion/dist
COPY --from=build-ts /app/packages/ingestion/package.json ./packages/ingestion/
COPY --from=build-ts /app/packages/mcp/dist ./packages/mcp/dist
COPY --from=build-ts /app/packages/mcp/package.json ./packages/mcp/
COPY --from=build-dashboard /app/packages/dashboard/dist ./packages/dashboard/dist
COPY config/ ./config/

EXPOSE 3100

CMD ["node", "packages/serving/dist/server.js"]
