FROM grafana/grafana:10.4.0

USER root

RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache curl

COPY provisioning/ /etc/grafana/provisioning/
COPY dashboards/ /etc/grafana/dashboards/

USER grafana

EXPOSE 3000

ENV GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-changeme}
ENV GF_USERS_ALLOW_SIGN_UP=false
ENV GF_PATHS_PROVISIONING=/etc/grafana/provisioning
