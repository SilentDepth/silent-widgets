import { defineHandler } from 'nitro'

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'

export default defineHandler(async event => {
  const token = process.env.GITHUB_API_TOKEN

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
    },
    body: await event.req.text(),
  })
  const text = await response.text()

  event.res.status = response.status
  event.res.headers.set('content-type', response.headers.get('content-type') || 'application/json')

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
})
