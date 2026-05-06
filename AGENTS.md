This project is based on [Nitro](https://nitro.build) v3, [h3](https://h3.dev/), [Vite](https://vite.dev/) and [rolldown](https://rolldown.rs/).

## Project Structure

`app/` is the frontend (SPA/SSR) with `index.html` as entry. `server/` contains server-side code with subdirs: `api/` (/api prefixed handlers), `routes/` (non-prefixed route handlers), `middleware/`, `plugins/`, `utils/`, `assets/`, and `tasks/`. `public/` holds static assets (copied, not bundled). Config files: `vite.config.ts` (loads nitro/vite plugin), `nitro.config.ts` (serverDir, routeRules, preset, etc.), `tsconfig.json` (extends nitro/tsconfig, `~/*` path alias).

## Conventions

- Path alias `~/*` (tsconfig), use explicit `.ts` extensions
- Route handlers use `defineHandler()` from `nitro`
- Route file patterns: `[param]` for dynamic, `[...slug]` for catch-all, `.get.ts`/`.post.ts` for method-specific, `(group)/` ignored in path

## Nitro Quick Reference

> Use `npx nitro docs` and `npx nitro docs --page` to read the nitro docs.

**`nitro`** — `defineConfig`, `defineHandler`, `defineMiddleware`, `defineWebSocketHandler`, `definePlugin` (hooks: `request`, `response`, `error`, `close`), `defineRouteMeta`, `defineErrorHandler`, `html`, `HTTPError`, `HTTPResponse`, `fetch`, `serverFetch`
**`nitro/h3`** — All h3 utilities (re-exported)
**`nitro/app`** — `useNitroApp()`, `useNitroHooks()`, `getRouteRules()`, `serverFetch()`, `fetch()`
**`nitro/cache`** — `defineCachedHandler(handler, opts)`, `defineCachedFunction(fn, opts)` (GET/HEAD only)
**`nitro/context`** — `useRequest()` (experimental, requires async context)
**`nitro/runtime-config`** — `useRuntimeConfig()`
**`nitro/storage`** — `useStorage(namespace?)` — KV (`getItem`, `setItem`, `removeItem`, `getKeys`)
**`nitro/database`** — `useDatabase()` — SQL via `` db.sql`SELECT ...` `` (requires `experimental: { database: true }`)
**`nitro/task`** — `defineTask({ meta, run })`, `runTask(name, { payload })` (requires `experimental: { tasks: true }`)
**`nitro/vite`** — `nitro()` Vite plugin (used in `vite.config.ts`)
**`nitro/vite/runtime`** — `fetchViteEnv()`
**`nitro/types`** — TypeScript type definitions

**Request Lifecycle:** Plugins `request` hook → Static assets → Route rules → Global middleware → Route-scoped middleware → Route handler → Server entry fallback → Renderer (SPA/SSR) → Plugins `response` hook

**Config (`nitro.config.ts`):** `routeRules` (per-route headers, redirects, proxy, cache, basicAuth), `$development` / `$production` (env-specific), `storage` + `devStorage` (KV drivers), `prerender: { routes, crawlLinks }`, `traceDeps` (externalize bundler-incompatible deps)

**`import.meta.*` flags:** `dev`, `preset`, `prerender`, `nitro`, `server`, `client`, `baseURL`

**Nitro v3 / H3 v2 migration:** `nitropack/runtime/*` → `nitro/*` (e.g. `nitro/storage`, `nitro/task`, `nitro/types`); all h3 imports from `nitro/h3`; `eventHandler()`/`defineEventHandler()` → `defineHandler()`; `createError()`/`H3Error` → `HTTPError`; `event.path` → `event.url.pathname`; `event.web` → `event.req` (native `Request`); body via `event.req.json()`/`.text()`/`.formData()`; headers via `event.req.headers.get()`/`event.res.headers.set()`; status via `event.res.status`; always `return` values (`return redirect(loc, code)`); `sendError()` → `throw HTTPError`; `sendNoContent()` → `return noContent()`; `useAppConfig()` removed.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

<!--VITE PLUS END-->
