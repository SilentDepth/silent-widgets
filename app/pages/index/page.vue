<script setup vapor lang="ts">
import WidgetIcon from '@/components/widget-icon.vue'
import { widgets } from '@/widgets/registry'
</script>

<template>
  <div class="directory-page">
    <header class="site-header">
      <a href="/" class="brand">Silent Widgets</a>
      <a href="#embed" class="help-link">使用说明 <span aria-hidden="true">↗</span></a>
    </header>
    <main>
      <section class="intro" aria-labelledby="page-title">
        <WidgetIcon name="blocks" class="page-icon" />
        <h1 id="page-title">Silent Widgets</h1>
        <p class="tagline">给 Notion 页面添加日历、进度和计数。</p>
        <p class="callout">
          <span aria-hidden="true" class="callout-arrow">↳</span>
          <span>选择小工具，调整参数，再把地址嵌入 Notion。</span>
        </p>
      </section>
      <section class="catalog" aria-labelledby="catalog-title">
        <div class="section-heading">
          <h2 id="catalog-title">小工具</h2>
          <span>{{ widgets.length }} 个</span>
        </div>
        <ul class="widget-list">
          <li v-for="widget of widgets" :key="widget.id">
            <a :href="`/${widget.id}/config`" class="widget-link">
              <WidgetIcon :name="widget.meta.icon" class="widget-icon" />
              <div class="widget-name">
                <h3>{{ widget.meta.name }}</h3>
                <span>{{ widget.meta.englishName }}</span>
              </div>
              <p class="widget-description">{{ widget.meta.description }}</p>
              <span class="configure">配置 <span aria-hidden="true">→</span></span>
            </a>
          </li>
        </ul>
      </section>
      <section id="embed" class="embed-guide" aria-labelledby="embed-title">
        <h2 id="embed-title">放进 Notion</h2>
        <ol class="steps">
          <li>
            <span class="step-number" aria-hidden="true">1</span>
            <div>
              <h3>选择小工具</h3>
              <p>从上方目录找到需要的工具。</p>
            </div>
          </li>
          <li>
            <span class="step-number" aria-hidden="true">2</span>
            <div>
              <h3>调整并复制</h3>
              <p>预览效果，点击“复制地址”。</p>
            </div>
          </li>
          <li>
            <span class="step-number" aria-hidden="true">3</span>
            <div>
              <h3>添加嵌入块</h3>
              <p>在 Notion 输入 <code>/embed</code>，<br class="desktop-break" />粘贴地址。</p>
            </div>
          </li>
        </ol>
        <a class="notion-help" href="https://www.notion.com/help/embed-and-connect-other-apps">
          查看 Notion 嵌入说明 <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
    <footer>Silent Widgets <span aria-hidden="true">·</span> 简单的小工具，放在你的页面里。</footer>
  </div>
</template>

<style scoped>
.directory-page {
  padding: 0 20px;
}
.site-header {
  max-width: 960px;
  min-height: 76px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  font-size: 14px;
}
.site-header a {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand {
  font-weight: 600;
}
.help-link,
.section-heading > span,
.widget-name > span,
.widget-description,
.steps p,
footer {
  color: var(--ui-muted);
}
main,
footer {
  max-width: 720px;
  margin: 0 auto;
}
.intro {
  margin-top: 64px;
}
.page-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 20px;
  stroke-width: 1.2;
}
h1 {
  font-size: 40px;
  line-height: 48px;
  font-weight: 700;
  letter-spacing: -1px;
}
.tagline {
  margin-top: 12px;
  font-size: 16px;
  line-height: 26px;
}
.callout {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding: 14px 16px;
  border-radius: 4px;
  background: var(--ui-surface);
  font-size: 14px;
  line-height: 24px;
}
.callout-arrow {
  font-size: 20px;
}
.catalog {
  margin-top: 40px;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 12px;
}
h2,
.widget-name h3 {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
}
.section-heading > span {
  font-size: 12px;
}
.widget-list {
  border-top: 1px solid var(--ui-line);
}
.widget-list li {
  border-bottom: 1px solid var(--ui-line);
}
.widget-link {
  display: grid;
  grid-template-columns: 28px 172px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  min-height: 86px;
  padding: 16px 4px;
  border-radius: 4px;
}
.widget-icon {
  width: 24px;
  height: 24px;
}
.widget-name > span {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  line-height: 18px;
}
.widget-description {
  font-size: 14px;
  line-height: 22px;
}
.configure {
  white-space: nowrap;
  font-size: 14px;
}
.configure > span {
  margin-left: 6px;
}
.widget-link:hover {
  background: var(--ui-surface);
}
a:focus-visible {
  outline: 2px solid var(--ui-accent);
  outline-offset: 4px;
  border-radius: 3px;
}
.embed-guide {
  margin-top: 44px;
  scroll-margin-top: 24px;
}
.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 20px;
  list-style: none;
}
.steps li {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.step-number {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: var(--ui-surface);
  font-size: 12px;
}
.steps h3 {
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
}
.steps p {
  margin-top: 6px;
  font-size: 13px;
  line-height: 22px;
}
.steps code {
  font-size: 12px;
}
.notion-help {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  margin-top: 10px;
  font-size: 13px;
  color: var(--ui-accent);
}
.notion-help:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
footer {
  padding: 28px 0 36px;
  margin-top: 36px;
  border-top: 1px solid var(--ui-line);
  font-size: 12px;
  line-height: 20px;
}
footer > span {
  margin: 0 6px;
}
@media (max-width: 600px) {
  .site-header {
    min-height: 64px;
    font-size: 13px;
  }
  .intro {
    margin-top: 38px;
  }
  .page-icon {
    width: 36px;
    height: 36px;
    margin-bottom: 16px;
  }
  h1 {
    font-size: 32px;
    line-height: 40px;
    letter-spacing: -0.7px;
  }
  .callout {
    padding: 12px;
    gap: 8px;
  }
  .catalog {
    margin-top: 32px;
  }
  .widget-link {
    grid-template-columns: 24px minmax(0, 1fr) auto;
    gap: 5px 12px;
    padding: 18px 0;
  }
  .widget-icon {
    align-self: start;
  }
  .widget-description {
    grid-column: 2 / -1;
    grid-row: 2;
    font-size: 13px;
  }
  .configure {
    grid-column: 3;
    grid-row: 1;
    font-size: 13px;
  }
  .configure > span {
    margin-left: 3px;
  }
  .embed-guide {
    margin-top: 32px;
  }
  .steps {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .steps p {
    margin-top: 2px;
  }
  .desktop-break {
    display: none;
  }
  footer {
    margin-top: 24px;
  }
}
</style>
