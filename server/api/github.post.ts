import process from 'node:process'
import { defineEventHandler, useRuntimeConfig } from 'nuxt/server'

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'

export default defineEventHandler(async event => {
  const token = useRuntimeConfig().githubApiToken || process.env.GITHUB_API_TOKEN

  if (!token) {
    event.res.status = 500
    return {
      errors: [{ message: 'GITHUB_API_TOKEN is not configured' }],
    }
  }

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'silent-widgets',
    },
    body: await event.req.text(),
  })
  event.res.status = response.status
  event.res.headers.set('content-type', response.headers.get('content-type') || 'application/json')

  return response.text()
})
