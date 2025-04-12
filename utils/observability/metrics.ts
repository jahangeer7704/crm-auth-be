import client from 'prom-client';

const register = new client.Registry();

register.setDefaultLabels({
  app: 'auth-service',
});

client.collectDefaultMetrics({ register });


export const authRequestDuration = new client.Histogram({
  name: 'auth_request_duration_seconds',        
  help: 'Duration of auth-related requests',    
  labelNames: ['route', 'method', 'status'],     
  buckets: [0.1, 0.25, 0.5, 1, 1.5, 2, 3, 5, 10], 
});
register.registerMetric(authRequestDuration);

export const loginAttempts = new client.Counter({
  name: 'login_attempts_total',
  help: 'Total number of login attempts',
  labelNames: ['status'], 
});
register.registerMetric(loginAttempts);


export const activeSessions = new client.Gauge({
  name: 'active_sessions',
  help: 'Current number of active user sessions',
});
register.registerMetric(activeSessions);


export { register };
