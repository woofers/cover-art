import { Hono } from 'hono'

const app = new Hono()

app.get('/public/*', async ctx => {
  return await ctx.env.ASSETS.fetch(ctx.req.raw)
})
app.get('/', async (c, next) => {
  console.log('hi')
  return c.text('hello')
})

export default app
