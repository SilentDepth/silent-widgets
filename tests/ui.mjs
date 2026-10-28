import assert from 'node:assert/strict'
import process from 'node:process'
import { after, before, test } from 'node:test'
import { launchBrowser } from '../benchmarks/nuxt-migration/chrome.mjs'

const base = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4106'
let browser
before(async () => {
  browser = await launchBrowser()
})
after(() => browser.close())
const hydrated = `document.querySelector('#__nuxt')?.__vue_app__?.$nuxt?.isHydrating === false`
const router = `document.querySelector('#__nuxt').__vue_app__.config.globalProperties.$router`

async function newPage() {
  const page = await browser.page()
  await page.call('Network.setExtraHTTPHeaders', { headers: { 'Accept-Language': 'en-US' } })
  return page
}

async function holdScripts(page) {
  const requests = []
  let holding = true
  let firstRequest
  const first = new Promise(resolve => {
    firstRequest = resolve
  })
  const unsubscribe = page.on('Fetch.requestPaused', ({ requestId }) => {
    if (holding) {
      requests.push(requestId)
      firstRequest()
    } else void page.call('Fetch.continueRequest', { requestId })
  })
  await page.call('Fetch.enable', { patterns: [{ urlPattern: '*/_nuxt/*.js' }] })
  return {
    first,
    async release() {
      holding = false
      await Promise.all(
        requests.map(requestId => page.call('Fetch.continueRequest', { requestId })),
      )
    },
    async stop() {
      unsubscribe()
      await page.call('Fetch.disable')
    },
  }
}

void test(
  'site language remains shared when cookies cannot persist',
  { timeout: 15000 },
  async t => {
    const page = await newPage()
    t.after(() => page.close())
    await page.call('Page.addScriptToEvaluateOnNewDocument', {
      source: `Object.defineProperty(document, 'cookie', {get: () => '', set: () => {}});`,
    })
    await page.navigate(`${base}/date-counter/config?date=2027-01-01`)
    await page.waitFor(hydrated)
    await page.evaluate(
      `const language = document.querySelector('header select'); language.value = 'zh-CN'; language.dispatchEvent(new Event('change', {bubbles:true}));`,
    )
    await page.waitFor(
      `document.documentElement.lang === 'zh-CN' && document.querySelector('.silent-widget')?.lang === 'zh-CN'`,
    )
    assert.equal(await page.evaluate('document.cookie'), '')
    await page.evaluate(`${router}.push('/'); true`)
    await page.waitFor(
      `location.pathname === '/' && document.querySelector('h1')?.textContent.includes('SILENT WIDGETS')`,
    )
    assert.equal(await page.evaluate('document.documentElement.lang'), 'zh-CN')
    assert.deepEqual(page.errors, [])
  },
)

void test(
  'pending page navigation prevents edits from cancelling it',
  { timeout: 15000 },
  async t => {
    const page = await newPage()
    let held
    t.after(async () => {
      await held?.stop()
      await page.close()
    })
    await page.call('Page.addScriptToEvaluateOnNewDocument', {
      source: 'window.requestIdleCallback = () => 0; window.cancelIdleCallback = () => {};',
    })
    await page.navigate(`${base}/date-counter/config?date=2027-01-01&event=First`)
    await page.waitFor(hydrated)
    held = await holdScripts(page)
    await page.evaluate(`window.pendingNavigation = ${router}.push('/'); true`)
    await held.first
    const inert = await page.evaluate(`document.querySelector('form').inert`)
    await page.evaluate(`document.querySelector('#param-event').focus()`)
    await page.call('Input.insertText', { text: 'Changed' })
    await held.release()
    const path = await page.evaluate('window.pendingNavigation.then(() => location.pathname)')
    assert.equal(inert, true, 'The old form must be inert while the destination chunk is pending')
    assert.equal(path, '/')
    assert.deepEqual(page.errors, [])
  },
)

void test(
  'pending widget keeps embed actions disabled until its preview mounts',
  { timeout: 15000 },
  async t => {
    const page = await newPage()
    let held
    t.after(async () => {
      await held?.stop()
      await page.close()
    })
    await page.call('Page.addScriptToEvaluateOnNewDocument', {
      source: 'window.requestIdleCallback = () => 0; window.cancelIdleCallback = () => {};',
    })
    await page.navigate(`${base}/date-counter/config?date=2027-01-01`)
    await page.waitFor(hydrated)
    held = await holdScripts(page)
    await page.evaluate(`${router}.push('/mini-calendar/config'); true`)
    await held.first
    await page.waitFor(`location.pathname === '/mini-calendar/config'`)
    assert.equal(
      await page.evaluate(`document.querySelector('select[aria-label="Choose a widget"]').value`),
      'date-counter',
    )
    assert.equal(await page.evaluate(`document.querySelector('#embed button').disabled`), true)
    await held.release()
    await page.waitFor(
      `document.querySelector('select[aria-label="Choose a widget"]')?.value === 'mini-calendar' && document.querySelector('#embed button')?.disabled === false`,
    )
    assert.deepEqual(page.errors, [])
  },
)

void test(
  'widget HMR connects through its own Nuxt HTTP listener',
  { skip: !process.env.DEV_BASE_URL, timeout: 15000 },
  async t => {
    const page = await newPage()
    const sockets = new Map()
    let connected
    const ready = new Promise(resolve => {
      connected = resolve
    })
    const created = page.on('Network.webSocketCreated', ({ requestId, url }) =>
      sockets.set(requestId, url),
    )
    const received = page.on('Network.webSocketFrameReceived', ({ requestId, response }) => {
      if (/"type"\s*:\s*"connected"/.test(response.payloadData)) connected(sockets.get(requestId))
    })
    t.after(async () => {
      created()
      received()
      await page.close()
    })
    await page.navigate(`${process.env.DEV_BASE_URL}/mini-calendar`)
    await page.waitFor(`document.querySelector('.silent-widget')`)
    const socket = new URL(await ready)
    assert.equal(socket.host, new URL(process.env.DEV_BASE_URL).host)
    assert.deepEqual(page.errors, [])
  },
)
