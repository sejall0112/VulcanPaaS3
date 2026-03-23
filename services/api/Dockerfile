FROM node:20-alpine

RUN apk add --no-cache curl dos2unix && \
    npm install -g npm@latest

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN dos2unix /app/entrypoint.sh 2>/dev/null || true

RUN addgroup -S vulcan && adduser -S vulcan -G vulcan
USER vulcan

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=2s --retries=3 --start-period=15s \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "server.js"]