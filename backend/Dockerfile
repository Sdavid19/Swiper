# =========================
# 1. BUILD STAGE
# =========================
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
# Incremental build kikapcsolása a biztonság kedvéért a Dockerben
RUN npm install
COPY . .
RUN npx prisma generate
# Kényszerített tiszta build
RUN npm run build

# =========================
# 2. RUNTIME STAGE
# =========================
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY prisma ./prisma
COPY --from=builder /app/dist ./dist

# Ez a sor segít, ha a Prisma kliens hiányozna
RUN npx prisma generate

EXPOSE 3000

# Ez a parancs megkeresi a main.js-t bárhol is van a dist-en belül és elindítja
CMD npx prisma migrate deploy && node $(find dist -name main.js | head -n 1)