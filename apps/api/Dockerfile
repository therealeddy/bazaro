# Build from the repository root:
#   docker build -f apps/api/Dockerfile -t bazaro-api .

FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /repo

# 1) Keep only the api and the workspace packages it depends on.
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.11.13 prune @bazaro/api --docker

# 2) Install (cached while the lockfile doesn't change), then build.
FROM base AS builder
COPY --from=pruner /repo/out/json/ .
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY --from=pruner /repo/out/full/ .
RUN pnpm turbo run build --filter=@bazaro/api
# Standalone copy of the api with production dependencies only.
RUN pnpm --filter=@bazaro/api deploy --prod /prod/api

# 3) Small runtime image, running as the non-root "node" user.
FROM node:24-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder --chown=node:node /prod/api .
USER node
EXPOSE 3333
CMD ["node", "dist/index.js"]
