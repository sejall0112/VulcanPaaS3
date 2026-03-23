FROM node:20-alpine

RUN apk add --no-cache curl dos2unix

WORKDIR /app

RUN addgroup -S vulcan && adduser -S vulcan -G vulcan

COPY package*.json ./

RUN npm ci --omit=dev

COPY server.js ./

RUN dos2unix server.js

RUN chown -R vulcan:vulcan /app

USER vulcan

EXPOSE 8080

CMD ["node", "server.js"]