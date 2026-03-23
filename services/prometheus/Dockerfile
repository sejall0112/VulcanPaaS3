FROM prom/prometheus:v3.3.0

USER root
COPY prometheus.yml /etc/prometheus/prometheus.yml
USER nobody

EXPOSE 9090

CMD ["--config.file=/etc/prometheus/prometheus.yml", \
     "--storage.tsdb.path=/prometheus", \
     "--storage.tsdb.retention.time=7d", \
     "--web.enable-lifecycle"]
