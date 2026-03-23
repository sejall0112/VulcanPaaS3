FROM node:20-alpine

RUN apk add --no-cache curl dos2unix nginx

WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/index.html

RUN dos2unix /etc/nginx/nginx.conf

RUN mkdir -p /var/log/nginx /var/lib/nginx/tmp /run/nginx

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=2s --retries=3 --start-period=15s \
    CMD curl -f http://localhost/nginx-health || exit 1

CMD ["nginx", "-g", "daemon off;"]