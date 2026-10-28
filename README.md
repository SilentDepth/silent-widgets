# Silent Widgets

可嵌入网页和 Notion 的小工具。目录和配置应用使用 Nuxt 4.6，独立小工具页面使用薄 SSR wrapper 和纯 Vue Vapor 入口。两部分部署在同一个 Cloudflare Worker。

## 本地开发

1. 运行 `vp install` 安装依赖。
2. 运行 `vp run dev` 启动 Nuxt 开发服务器。

`vp run dev` 在同一端口提供 Nuxt 应用和独立小工具，两边均支持 Vite 热更新。独立小工具的 HMR WebSocket 也复用此端口。

`vp run build` 通过本地 Nuxt module 同时构建两套入口。`vite.config.ts` 仅配置 Vite+ 的格式、Lint 和测试工具。

## 项目结构

| 路径                            | 内容                               |
| ------------------------------- | ---------------------------------- |
| `app/pages/index.vue`           | 小工具目录                         |
| `app/pages/[widget]/config.vue` | 参数配置页面                       |
| `app/widgets/`                  | 小工具组件、参数定义和翻译         |
| `app/layouts/site.vue`          | 目录和配置页的布局                 |
| `widgets/`                      | 独立 Vapor 应用、SSR 和客户端入口  |
| `modules/widgets.ts`            | 独立入口构建、开发中间件和路由注册 |
| `server/handlers/widget.ts`     | 独立页面的 Nitro 请求处理          |
| `server/api/github.post.ts`     | GitHub GraphQL 代理                |
| `nuxt.config.ts`                | Nuxt、Vite 插件和 Cloudflare 配置  |

Nuxt 为 `/` 和 `/:widget/config` 提供文件路由、SSR、页面元数据、客户端导航和 Cookie 状态。五个独立 `/:widget` URL 由 Nitro 直接调用 `widgets/entry-server.ts` 的构建产物，绕过 Nuxt 页面渲染。

独立 HTML 只加载 `/_widgets/` 下的资源，并由 `createVaporSSRApp` 启动。它不加载 Nuxt、Vue Router、Unhead、站点布局或 Nuxt 状态脚本。构建检查会拒绝这些框架依赖进入 widget 产物。

独立页和配置页预览复用 `app/widgets/` 的组件、参数和翻译。共享代码显式导入 Vue 与包依赖，不能调用 Nuxt composable。日期类组件使用很小的 Vapor `ClientOnly`，继续按浏览器本地时区计算日期和时间。

## GitHub API

仓库星标小工具需要服务端令牌。设置私有运行时变量 `NUXT_GITHUB_API_TOKEN`，或继续使用 `GITHUB_API_TOKEN`。不要将令牌放入 `runtimeConfig.public`。

## 验证与构建

```sh
vp check
vp run typecheck
vp test
vp run build
vp run preview
```

`vp run build` 生成 Cloudflare Worker 和静态资源。`vp run preview` 预览生产构建。`keep_vars` 保留已配置的 Worker 变量。

如果本地 Worker 已在端口 8787 运行，执行生产路由回归检查：

```sh
SMOKE_BASE_URL=http://127.0.0.1:8787 vp test
```

普通 `vp test` 运行接口单元测试。生产路由测试仅在设置 `SMOKE_BASE_URL` 时运行。

本机已安装 Google Chrome 时，可运行浏览器状态回归：

```sh
SMOKE_BASE_URL=http://127.0.0.1:8787 vp run test:ui
```

同时设置 `DEV_BASE_URL` 可检查开发环境的 HMR 连接。这些检查覆盖 Cookie 无法保存、慢导航和延迟 widget 加载，不会修改浏览器的常用配置。

初次全 Nuxt 迁移的历史结果见 [迁移报告](benchmarks/nuxt-migration/README.md)。当前独立 widget 架构的测量与对照见 [拆分报告](benchmarks/nuxt-migration/standalone/README.md)。
