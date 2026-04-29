FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci


COPY prisma ./prisma
RUN npx prisma generate


COPY . .
RUN npm run build


FROM node:20-slim

WORKDIR /app


COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]