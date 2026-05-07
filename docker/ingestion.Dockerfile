FROM node:22-slim AS builder

# Install Python for graphify bridge
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-pip python3-venv git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install graphify bridge
COPY services/graphify-bridge/ /app/graphify-bridge/
RUN python3 -m venv /app/.venv && \
    /app/.venv/bin/pip install --no-cache-dir -e /app/graphify-bridge/

# Add graphify to PATH
ENV PATH="/app/.venv/bin:$PATH"

# Install ALL Node.js dependencies (including devDeps for tsc build)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/ingestion/package.json packages/ingestion/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/
RUN corepack enable && pnpm install --prefer-frozen-lockfile

# Copy source and build
COPY packages/shared/ packages/shared/
COPY packages/db/ packages/db/
COPY packages/ingestion/ packages/ingestion/
RUN pnpm -F @cortex/shared build && \
    pnpm -F @cortex/db build && \
    pnpm -F @cortex/ingestion build

# ── Production stage ─────────────────────────────────────────────────────────
FROM node:22-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-venv git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python venv from builder
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/graphify-bridge /app/graphify-bridge
ENV PATH="/app/.venv/bin:$PATH"

# Copy built Node.js packages + runtime deps
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/packages/shared ./packages/shared/
COPY --from=builder /app/packages/db ./packages/db/
COPY --from=builder /app/packages/ingestion ./packages/ingestion/

CMD ["node", "packages/ingestion/dist/workers/index.js"]
