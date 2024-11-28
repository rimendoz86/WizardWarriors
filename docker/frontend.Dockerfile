FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat=1.1.0-r4
WORKDIR /opt/ww-ui

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-$NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL:-$NEXT_PUBLIC_WS_URL}

COPY ./ww-ui/package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /opt/ww-ui

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-$NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL:-$NEXT_PUBLIC_WS_URL}

COPY --from=deps /opt/ww-ui/node_modules ./node_modules
COPY ./ww-ui .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /opt/ww-ui

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-$NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL:-$NEXT_PUBLIC_WS_URL}
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs && \
  apk add --no-cache curl=8.11.0-r2

COPY --from=builder --chown=nextjs:nodejs /opt/ww-ui/.next/standalone ./standalone
COPY --from=builder --chown=nextjs:nodejs /opt/ww-ui/.next/static standalone/.next/static
COPY --from=builder /opt/ww-ui/public standalone/public

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "standalone/server.js"]
