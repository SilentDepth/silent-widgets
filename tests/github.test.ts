import process from 'node:process'
import type { RequestEvent } from 'nuxt/schema'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import github from '../server/api/github.post'

const { config } = vi.hoisted(() => ({ config: { githubApiToken: '' } }))
vi.mock('nuxt/server', () => ({
  defineEventHandler: (handler: (event: RequestEvent) => unknown) => handler,
  useRuntimeConfig: () => config,
}))

function requestEvent() {
  const url = new URL('https://widgets.example/api/github')
  return {
    url,
    req: new Request(url, { method: 'POST', body: '{"query":"query { viewer { login } }"}' }),
    context: {},
    res: { status: 200, headers: new Headers() },
  }
}

beforeEach(() => {
  config.githubApiToken = ''
  vi.stubEnv('GITHUB_API_TOKEN', '')
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('GitHub proxy compatibility', () => {
  it('returns the existing error when no token is configured', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch')
    const event = requestEvent()
    expect(await github(event)).toEqual({
      errors: [{ message: 'GITHUB_API_TOKEN is not configured' }],
    })
    expect(event.res.status).toBe(500)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('keeps the legacy token, raw GraphQL body and upstream error response', async () => {
    vi.stubEnv('GITHUB_API_TOKEN', 'fixture-legacy-token')
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{"errors":[{"message":"Rate limited"}]}', {
        status: 429,
        headers: { 'content-type': 'application/json' },
      }),
    )
    const event = requestEvent()
    expect(await github(event)).toBe('{"errors":[{"message":"Rate limited"}]}')
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        'content-type': 'application/json',
        'user-agent': 'silent-widgets',
      },
      body: '{"query":"query { viewer { login } }"}',
    })
    expect(event.res.status).toBe(429)
    expect(event.res.headers.get('content-type')).toBe('application/json')
  })

  it('accepts the Nuxt runtime configuration without exposing the token', async () => {
    config.githubApiToken = 'fixture-nuxt-token'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({ data: { repository: { stargazerCount: 1234 } } }),
    )
    const event = requestEvent()
    expect(await github(event)).toBe('{"data":{"repository":{"stargazerCount":1234}}}')
    expect(event.res.status).toBe(200)
  })
})
