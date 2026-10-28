import { basename, dirname, join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineEventHandler, fromNodeMiddleware } from 'h3'
import { addDevServerHandler, addServerHandler, defineNuxtModule, resolveFiles } from 'nuxt/kit'
import { build, createServer } from 'vite'
import type { InlineConfig, Manifest, ViteDevServer } from 'vite'
import { widgetIdFromPath } from '../app/utils/widget-path'

export default defineNuxtModule({
  meta: { name: 'standalone-widgets' },
  async setup(_options, nuxt) {
    const root = nuxt.options.rootDir
    const output = join(nuxt.options.buildDir, 'widgets')
    const configs = await resolveFiles(join(root, 'app/widgets'), ['*/config.ts'])
    const ids = configs.map(file => basename(dirname(file)))
    const config = (): InlineConfig => ({
      root,
      configFile: false,
      base: '/_widgets/',
      cacheDir: join(output, 'cache'),
      publicDir: false,
      plugins: [
        vue(),
        tailwindcss(),
        {
          name: 'standalone-widget-boundary',
          generateBundle(_options, bundle) {
            for (const chunk of Object.values(bundle)) {
              if (chunk.type !== 'chunk') continue
              for (const id of Object.keys(chunk.modules)) {
                if (
                  /node_modules\/(nuxt|@nuxt|vue-router|@unhead)\//.test(id.replaceAll('\\', '/'))
                ) {
                  this.error(`Standalone widget imports an app dependency: ${id}`)
                }
              }
            }
          },
        },
      ],
      resolve: { alias: { '@': join(root, 'app') } },
      define: {
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      },
      ssr: { target: 'webworker', noExternal: true },
    })

    if (nuxt.options.dev) {
      const vite = new Promise<ViteDevServer>(resolve => {
        nuxt.hooks.hookOnce('listen', async listenerServer => {
          const server = await createServer({
            ...config(),
            appType: 'custom',
            server: {
              middlewareMode: true,
              // Nuxt leaves upgrades under its asset directory to Vite.
              ws: {
                server: listenerServer,
                path: `../${nuxt.options.app.buildAssetsDir}/widget-hmr`,
              },
            },
            optimizeDeps: { include: ['vue', '@vueuse/core', 'ts-pattern'] },
          })
          nuxt.hook('close', () => server.close())
          resolve(server)
        })
      })
      addDevServerHandler({
        route: '/_widgets/**',
        handler: {
          nitro2: defineEventHandler(async event =>
            fromNodeMiddleware((await vite).middlewares)(event),
          ),
        },
      })
      for (const id of ids) {
        addDevServerHandler({
          route: `/${id}`,
          handler: {
            nuxt: async event => {
              if (widgetIdFromPath(event.url.pathname) !== id) return
              const server = await vite
              const { renderWidget } = (await server.ssrLoadModule('/widgets/entry-server.ts')) as {
                renderWidget: (request: Request, manifest: Manifest) => Promise<string>
              }
              const html = await renderWidget(event.req, {
                'widgets/entry-client.ts': { file: 'widgets/entry-client.ts' },
              })
              event.res.headers.set('Content-Type', 'text/html;charset=utf-8')
              event.res.headers.set('Vary', 'Accept-Language')
              // Vite adds the configured base to the entry URL in development.
              return server.transformIndexHtml(
                event.url.pathname,
                html.replace('src="/_widgets/', 'src="/'),
              )
            },
          },
        })
      }
      return
    }

    nuxt.options.nitro.alias ??= {}
    nuxt.options.nitro.alias['#widget-renderer'] = join(output, 'server/entry-server.mjs')
    nuxt.options.nitro.alias['#widget-assets'] = join(output, 'public/.vite/manifest.json')
    nuxt.options.nitro.publicAssets ??= []
    nuxt.options.nitro.publicAssets.push({
      dir: join(output, 'public'),
      baseURL: '/_widgets/',
      maxAge: 31_536_000,
    })
    for (const id of ids) {
      addServerHandler({
        route: `/${id}`,
        handler: join(root, 'server/handlers/widget'),
      })
    }
    nuxt.hook('build:before', async () => {
      if (nuxt.options._prepare) return
      await build({
        ...config(),
        build: {
          outDir: join(output, 'public'),
          emptyOutDir: true,
          manifest: true,
          rolldownOptions: { input: join(root, 'widgets/entry-client.ts') },
        },
      })
      await build({
        ...config(),
        // Nitro bundles shared dependencies once for both server renderers.
        ssr: {
          target: 'webworker',
          external: ['vue', 'vue/server-renderer', '@vueuse/core', 'ts-pattern'],
        },
        build: {
          outDir: join(output, 'server'),
          emptyOutDir: true,
          ssr: join(root, 'widgets/entry-server.ts'),
          rolldownOptions: { output: { entryFileNames: 'entry-server.mjs' } },
        },
      })
    })
  },
})
