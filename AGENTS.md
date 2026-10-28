# Code of Conduct for Agents

## General Code Style Principles

- Keep things in one function unless composable or reusable.
- Validate unknown values once at the boundary that owns them. Pass typed values inward instead of repeating typeof value === "object" and property-existence checks. Do not defensively revalidate values already guaranteed by a schema, constructor, or internal type.
- Do not extract single-use helpers preemptively. Inline the logic at the call site unless the helper is reused, hides a genuinely complex boundary, or has a clear independent name that improves the caller.
- Before adding complexity for a speculative or vanishingly unlikely race or security edge case, explain the concrete failure mode, likelihood, and complexity cost to the user and get their buy-in. Do not silently expand scope for theoretical robustness.
- Avoid `try`/`catch` where possible.
- Avoid using the `any` type.
- Rely on type inference when possible; avoid explicit type annotations or interfaces unless necessary for exports or clarity.

## Deployment Target

This project should be runnable on Cloudflare Workers. Avoid using Node.js API if it is not compatible to Cloudflare Workers.

<!--NUXT START-->

## Nuxt 4 conventions

This project uses Nuxt 4 for the site app, standalone Vue Vapor widget pages, and the built-in Nitro server builder.

- Put pages in `app/pages/`, layouts in `app/layouts/`, and components in `app/components/`.
- Use Nuxt file routing, `NuxtLink`, `navigateTo`, `useRoute`, and `useRouter` for navigation.
- Use `useHead` and `useSeoMeta` for Nuxt page metadata.
- Keep independent `/:widget` pages outside Nuxt routing. `modules/widgets.ts` registers their Nitro handlers and separate Vite builds; `widgets/` contains their thin SSR and pure Vapor client entry.
- Links from the Nuxt app to independent widget URLs must perform document navigation, for example with `external` on `NuxtLink`.
- Reuse `app/widgets/` in both entries. Shared widget code uses explicit Vue/package imports and the local Vapor `ClientOnly` for browser-local dates; do not import Nuxt, Vue Router, or Unhead there.
- Keep `app/app.vue` on the virtual DOM. Enable Vapor components with `vue.vapor` in `nuxt.config.ts`.
- Use Nuxt auto-imports in the site app. Shared widget dependencies must also work in the standalone build without auto-imports.
- Share the site language with `useState`; use the Cookie for persistence so language selection also works when Cookie writes are blocked.
- Put API handlers in `server/api/`. Import `defineEventHandler` from `nuxt/server` for portable request events.
- Portable handlers use `event.req` as a standard `Request` and `event.res` for response status and headers.
- Use `useRuntimeConfig()` for the private `NUXT_GITHUB_API_TOKEN`. The GitHub proxy also accepts the existing `GITHUB_API_TOKEN`.
- Configure Nuxt, Vite plugins, and the Cloudflare preset in `nuxt.config.ts`.
- Keep `vite.config.ts` for Vite+ formatting, linting, and tests. Nuxt owns the site application build; the local widget module integrates standalone builds into the same commands and deployment.
- Run `vp run dev`, `vp run build`, `vp run preview`, and `vp run typecheck` for the Nuxt scripts.
- Run `vp check` and `vp test` for project checks. `vp run typecheck` checks both Nuxt and `widgets/tsconfig.json`. Benchmark scripts and recorded results are in `benchmarks/nuxt-migration/`, with the current split-entry results under `standalone/`.

<!--NUXT END-->

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and Nuxt invokes Vite for this project; run the Nuxt scripts with `vp run dev` and `vp run build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
