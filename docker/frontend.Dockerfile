FROM node:22-alpine as deps
RUN apk add --no-cache libc6-compat=1.1.0-r4
WORKDIR /opt/ww-ui

ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL:-$NEXT_PUBLIC_WS_URL}

COPY ./ww-ui/package*.json ./
RUN npm ci

FROM node:22-alpine as builder
WORKDIR /opt/ww-ui

ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL:-$NEXT_PUBLIC_WS_URL}

COPY --from=deps /opt/ww-ui/node_modules ./node_modules
COPY ./ww-ui .
RUN npm run build

FROM node:22-alpine as runner
WORKDIR /opt/ww-ui

ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL:-$NEXT_PUBLIC_WS_URL}
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /opt/ww-ui/public ./public
COPY --from=builder --chown=nextjs:nodejs /opt/ww-ui/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /opt/ww-ui/.next/standalone/ ./

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
