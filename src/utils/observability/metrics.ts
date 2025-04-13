import client from 'prom-client';

const register = new client.Registry();

register.setDefaultLabels({
  app: 'auth-service',
});

client.collectDefaultMetrics({ register });

export const authRequestDuration = new client.Histogram({
  name : 'auth_request_duration_seconds',
  help : 'Duration of authentication related request',
  labelNames : ['route', 'method', 'status'],
  buckets : [0.1,0.25,0.5,1,2,5,10]
});

register.registerMetric(authRequestDuration);

export const LoginAttempts = new client.Counter({
  name : 'total_login_attempt',
  help : 'Total Number of Login Attempts',
  labelNames : ['status'],
});

register.registerMetric(LoginAttempts);

export const RegisterCount = new client.Counter({
  name : 'register_count',
  help : 'Total Number of New User',
  labelNames : ['status']
});

register.registerMetric(RegisterCount);

export const ActiveSessions = new client.Gauge({
  name : 'active_session',
  help : 'Current Number of active session'
});

register.registerMetric(ActiveSessions);



export {register};

