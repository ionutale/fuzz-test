FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY go.mod ./
# COPY go.sum ./ 
# (Go sum doesn't exist yet, uncomment when dependencies are added)
RUN go mod download
COPY . .
RUN go build -o main .

FROM alpine:latest

# Install Docker CLI so the runner can spawn sibling containers
RUN apk add --no-cache docker-cli

WORKDIR /app
COPY --from=builder /app/main .

# Create artifacts directory
RUN mkdir -p /app/artifacts

EXPOSE 8080
CMD ["./main"]
