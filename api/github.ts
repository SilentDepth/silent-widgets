import type { VercelApiHandler } from '@vercel/node'
import { createProxyMiddleware } from 'http-proxy-middleware'

const proxy = createProxyMiddleware({
  target: 'https://api.github.com',
  pathRewrite: () => '/graphql',
  changeOrigin: true,
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
  },
})

export default proxy as VercelApiHandler
