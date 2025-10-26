import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware para logs bonitos
app.use('*', logger());
app.use('*', cors());

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    service: 'gateway',
    timestamp: new Date().toISOString() 
  });
});

// Rutas proxy a microservicios
app.all('/api/users/*', async (c) => {
  const path = c.req.path.replace('/api/users', '');
  const url = `http://users-service:4000${path}`;
  
  console.log(`[GATEWAY] Proxying to users-service: ${url}`);
  
  const response = await fetch(url, {
    method: c.req.method,
    headers: c.req.header(),
    body: c.req.method !== 'GET' ? await c.req.text() : undefined,
  });
  
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

app.all('/api/routines/*', async (c) => {
  const path = c.req.path.replace('/api/routines', '');
  const url = `http://routines-service:4000${path}`;
  console.log(`[GATEWAY] Proxying to routines-service: ${url}`);
  
  const response = await fetch(url, {
    method: c.req.method,
    headers: c.req.header(),
    body: c.req.method !== 'GET' ? await c.req.text() : undefined,
  });
  
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

app.all('/api/nutrition/*', async (c) => {
  const path = c.req.path.replace('/api/nutrition', '');
  const url = `http://nutrition-service:4000${path}`;
  console.log(`[GATEWAY] Proxying to nutrition-service: ${url}`);
  
  const response = await fetch(url, {
    method: c.req.method,
    headers: c.req.header(),
    body: c.req.method !== 'GET' ? await c.req.text() : undefined,
  });
  
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

app.all('/api/progress/*', async (c) => {
  const path = c.req.path.replace('/api/progress', '');
  const url = `http://progress-service:4000${path}`;
  console.log(`[GATEWAY] Proxying to progress-service: ${url}`);
  
  const response = await fetch(url, {
    method: c.req.method,
    headers: c.req.header(),
    body: c.req.method !== 'GET' ? await c.req.text() : undefined,
  });
  
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

const port = process.env.PORT || 4000;

console.log(`🚀 Gateway running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};