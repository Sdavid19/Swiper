# ==================== BUILD STAGE ====================
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Prisma generate
COPY prisma ./prisma
RUN npx prisma generate

# Teljes forrás másolása és build
COPY . .
RUN npm run build

# ==================== PRODUCTION STAGE ====================
FROM node:20-slim

WORKDIR /app

# Függőségek
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Fontos: a dist/src mappát másoljuk, ne csak dist-et!
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# OpenSSL (Prisma miatt kellhet)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

# Itt kell a helyes útvonal: dist/src/main.js
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]