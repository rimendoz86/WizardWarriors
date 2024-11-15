# syntax=docker/dockerfile:1

FROM golang:1.21.5-alpine as builder
ARG DATABASE_URL
ARG REDIS_URL
ENV DATABASE_URL $DATABASE_URL
ENV REDIS_URL $REDIS_URL

RUN mkdir /opt/ww
WORKDIR /opt/ww

RUN apk add --no-cache git=2.43.5-r0 build-base=0.5-r3

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

WORKDIR /opt/ww/cmd/ww-srv

RUN go build -o ww-srv

FROM alpine:3.19.0
ARG DATABASE_URL
ARG REDIS_URL
ENV DATABASE_URL $DATABASE_URL
ENV REDIS_URL $REDIS_URL

RUN mkdir /opt/ww
WORKDIR /opt/ww
COPY --from=builder /opt/ww/cmd/ww-srv/ww-srv /opt/ww/ww-srv

EXPOSE 8081

CMD ["sh", "-c", "./ww-srv -DATABASE_URL=$DATABASE_URL -REDIS_URL=$REDIS_URL"]
