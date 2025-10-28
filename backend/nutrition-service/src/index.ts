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
    service: 'nutrition',
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

const port = process.env.PORT || 4000;

console.log(`🚀 Nutrition Service running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};