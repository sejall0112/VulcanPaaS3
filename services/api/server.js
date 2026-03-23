'use strict';

const express = require('express');
const client = require('prom-client');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.API_PORT || 8080;
const SERVICE = 'api';

// -- Prometheus metrics --------------------------------------------------------
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// -- Logging helper ------------------------------------------------------------
function log(level, message, metadata = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: SERVICE,
    message,
    request_id: metadata.request_id || '',
    metadata,
  }));
}

// -- Middleware ----------------------------------------------------------------
app.use((req, res, next) => {
  req.request_id = uuidv4();
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const labels = { method: req.method, route: req.path, status: res.statusCode };
    httpRequestsTotal.inc(labels);
    end(labels);
    log('INFO', `${req.method} ${req.path} ${res.statusCode}`, {
      request_id: req.request_id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
    });
  });
  next();
});

// -- Routes --------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: SERVICE,
    timestamp: new Date().toISOString(),
  });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: SERVICE,
    version: process.env.IMAGE_TAG || 'local',
    timestamp: new Date().toISOString(),
  });
});

// -- Start ---------------------------------------------------------------------
app.listen(PORT, () => {
  log('INFO', `API service started on port ${PORT}`);
});