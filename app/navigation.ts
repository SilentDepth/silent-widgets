import type { SupportedLang } from '@/composables/use-i18n'
import type { PageNavigation } from '@/composables/use-page-navigation'
import { resolveWidgetRoute } from '@/utils/widget-utils'
import { loadPage } from './routes'
import type { PageView } from './routes'

const HISTORY_KEY = '__silentWidgets'
type Position = { left: number; top: number }
type HistoryEntry = { id: string; scroll?: Position }

function siteRoute(url: URL) {
  const route = resolveWidgetRoute(url.pathname)
  return route?.kind === 'index'
    ? 'index'
    : route?.kind === 'config'
      ? `config:${route.widget.id}`
      : null
}

function historyEntry(state: unknown): HistoryEntry | undefined {
  const entry = (state as Record<string, HistoryEntry> | null)?.[HISTORY_KEY]
  return entry && typeof entry.id === 'string' ? entry : undefined
}

export function createPageNavigation(
  view: PageView,
  initialUrl: URL,
  automatic: SupportedLang,
  root: HTMLElement,
  siteLanguage: () => SupportedLang,
): PageNavigation & { start: () => void; dispose: () => void } {
  const isNavigating = shallowRef(false)
  const positions = new Map<string, Position>()
  const originalRestoration = history.scrollRestoration
  let activeUrl = initialUrl
  let activeId = ''
  let revision = 0
  let titleTransition: ViewTransition | undefined

  function setPending(pending: boolean) {
    isNavigating.value = pending
    if (pending) root.setAttribute('aria-busy', 'true')
    else root.removeAttribute('aria-busy')
  }

  function rememberScroll() {
    const scroll = { left: window.scrollX, top: window.scrollY }
    positions.set(activeId, scroll)
    if (historyEntry(history.state)?.id === activeId) {
      history.replaceState(
        { ...history.state, [HISTORY_KEY]: { id: activeId, scroll } },
        '',
        location.href,
      )
    }
  }

  function restoreScroll(url: URL, position?: Position) {
    if (position && Number.isFinite(position.left) && Number.isFinite(position.top)) {
      window.scrollTo(position)
      return
    }
    let fragment = url.hash.slice(1)
    try {
      fragment = decodeURIComponent(fragment)
    } catch {
      // A malformed fragment must not interrupt navigation.
    }
    const target = fragment ? document.getElementById(fragment) : null
    if (target) target.scrollIntoView()
    else window.scrollTo({ left: 0, top: 0 })
  }

  async function visit(url: URL, pop = false) {
    const current = ++revision
    titleTransition?.skipTransition()
    if (url.origin !== initialUrl.origin || !siteRoute(url)) {
      if (pop) location.reload()
      else location.assign(url.href)
      return
    }
    rememberScroll()
    const destination = pop ? historyEntry(history.state) : undefined
    const id = destination?.id ?? crypto.randomUUID()
    const position = pop ? (positions.get(id) ?? destination?.scroll) : undefined
    const samePage = siteRoute(url) === siteRoute(activeUrl) && url.search === activeUrl.search
    setPending(true)
    try {
      const page = samePage ? view.page : await loadPage(url, automatic, siteLanguage())
      if (current !== revision) return
      if (!page) throw new Error('Page not found')
      const updatePage = async () => {
        if (current !== revision) return
        rememberScroll()
        if (pop) {
          history.replaceState(
            { ...history.state, [HISTORY_KEY]: { id, scroll: position } },
            '',
            url,
          )
        } else if (url.href !== activeUrl.href) {
          history.pushState({ [HISTORY_KEY]: { id } }, '', url)
        }
        activeId = historyEntry(history.state)!.id
        activeUrl = url
        if (!samePage) {
          view.page = page
          view.revision++
          await nextTick()
          if (current !== revision) return
          const heading = root.querySelector<HTMLElement>('h1')
          heading?.setAttribute('tabindex', '-1')
          heading?.focus({ preventScroll: true })
        }
        restoreScroll(url, position)
      }
      const changesTitle =
        (view.page.kind === 'index' && page.kind === 'config') ||
        (view.page.kind === 'config' && page.kind === 'index')
      if (
        changesTitle &&
        document.startViewTransition &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        // Keep the outgoing title visible after its page has been unmounted.
        const transition = document.startViewTransition(updatePage)
        titleTransition = transition
        void transition.finished
          .catch(() => {})
          .finally(() => {
            if (titleTransition === transition) titleTransition = undefined
          })
        await transition.updateCallbackDone
      } else {
        await updatePage()
      }
    } catch {
      if (current !== revision) return
      // A stale or unavailable chunk can still be recovered by a normal page request.
      if (pop) location.reload()
      else location.assign(url.href)
    } finally {
      if (current === revision) setPending(false)
    }
  }

  function onClick(event: MouseEvent) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const anchor = event.composedPath().find(node => node instanceof HTMLAnchorElement) as
      | HTMLAnchorElement
      | undefined
    if (
      !anchor ||
      !root.contains(anchor) ||
      !anchor.hasAttribute('href') ||
      anchor.hasAttribute('download') ||
      (anchor.target && anchor.target !== '_self') ||
      anchor.relList.contains('external')
    )
      return
    const url = new URL(anchor.href)
    if (url.origin !== initialUrl.origin || !siteRoute(url)) return
    event.preventDefault()
    void visit(url)
  }

  function onPopState() {
    void visit(new URL(location.href), true)
  }

  return {
    isNavigating: readonly(isNavigating),
    navigate: href => {
      void visit(new URL(href, activeUrl))
    },
    replaceUrl: url => {
      if (
        isNavigating.value ||
        url.origin !== activeUrl.origin ||
        siteRoute(url) !== siteRoute(activeUrl)
      )
        return
      const next = new URL(url)
      next.hash = activeUrl.hash
      history.replaceState(history.state, '', next)
      activeUrl = next
    },
    start() {
      activeId = historyEntry(history.state)?.id ?? crypto.randomUUID()
      rememberScroll()
      history.replaceState({ ...history.state, [HISTORY_KEY]: { id: activeId } }, '', activeUrl)
      history.scrollRestoration = 'manual'
      document.addEventListener('click', onClick)
      window.addEventListener('popstate', onPopState)
    },
    dispose() {
      revision++
      titleTransition?.skipTransition()
      setPending(false)
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPopState)
      history.scrollRestoration = originalRestoration
    },
  }
}
