import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { api } from './routes'
import { logger } from 'hono/logger'
import { customLogger } from './common/Logger'

const app = new Hono()
app.use(logger(customLogger))
app.get('/health', (c) => c.text('User Service is alive!!'))
app.use(prettyJSON())
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))

app.get('/favicon.ico', (c) => c.text(''))
app.route('/', api)

export default {
  port: process.env.PORT!,
  fetch: app.fetch
}