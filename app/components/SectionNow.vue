<script setup lang="ts">
type FutureEntry = {
  title: string
  content: string
}

type LogEntry = {
  date: string
  content: string
}

const futureEntries: FutureEntry[] = [
  {
    title: '\u628a\u4e2a\u4eba\u7f51\u7ad9\u7ee7\u7eed\u6253\u78e8\u5b8c\u6574',
    content: '\u628a\u9875\u9762\u7ec6\u8282\u3001\u8282\u594f\u548c\u5185\u5bb9\u6162\u6162\u6536\u62fe\u5230\u66f4\u8212\u670d\u7684\u72b6\u6001\u3002'
  },
  {
    title: '\u8865\u4e0a\u540e\u7aef\u57fa\u7840\u80fd\u529b',
    content: '\u628a\u63a5\u53e3\u3001\u9274\u6743\u3001\u90e8\u7f72\u8fd9\u4e9b\u80fd\u529b\u4e00\u70b9\u70b9\u8865\u8d77\u6765\u3002'
  },
  {
    title: '\u63d0\u9ad8\u82f1\u6587\u9605\u8bfb\u901f\u5ea6',
    content: '\u80fd\u66f4\u987a\u624b\u5730\u770b\u6587\u6863\u3001\u770b\u535a\u5ba2\uff0c\u4e5f\u80fd\u5c11\u4e00\u70b9\u505c\u987f\u3002'
  },
  {
    title: '\u505a\u7a33\u5b9a\u7684\u8f93\u51fa\u8bb0\u5f55',
    content: '\u628a\u5b66\u5230\u7684\u4e1c\u897f\u548c\u6bcf\u5929\u7684\u8fdb\u5c55\u7559\u4e0b\u6765\uff0c\u4e0d\u518d\u53ea\u505c\u5728\u8111\u5b50\u91cc\u3002'
  },
  {
    title: '\u4fdd\u6301\u8282\u594f\uff0c\u4e0d\u6025\u7740\u8bc1\u660e\u4ec0\u4e48',
    content: '\u5148\u628a\u773c\u524d\u7684\u4e8b\u505a\u597d\uff0c\u518d\u6162\u6162\u628a\u8def\u8d70\u5bbd\u3002'
  }
]

const logs: LogEntry[] = [
  {
    date: '04 / 02',
    content: '\u5728\u6539\u4e2a\u4eba\u7f51\u7ad9\u7684\u6392\u7248\uff0c\u628a Inspiration \u548c Now \u8fd9\u4e24\u5757\u91cd\u65b0\u642d\u5f97\u66f4\u987a\u4e00\u70b9\u3002'
  },
  {
    date: '04 / 01',
    content: '\u770b\u4e86\u4e00\u4e9b Nuxt \u548c\u670d\u52a1\u7aef\u63a5\u53e3\u7684\u5199\u6cd5\uff0c\u4e5f\u987a\u624b\u63a5\u4e86 Last.fm \u7684\u6700\u8fd1\u64ad\u653e\u3002'
  },
  {
    date: '03 / 31',
    content: '\u628a\u6700\u8fd1\u60f3\u505a\u7684\u65b9\u5411\u91cd\u65b0\u6574\u7406\u4e86\u4e00\u904d\uff0c\u5c3d\u91cf\u53ea\u7559\u4e0b\u771f\u6b63\u4f1a\u53bb\u505a\u7684\u4e8b\u60c5\u3002'
  },
  {
    date: '03 / 30',
    content: '\u82b1\u65f6\u95f4\u770b\u4e86\u70b9\u540e\u7aef\u77e5\u8bc6\uff0c\u4e5f\u5728\u60f3\u600e\u4e48\u628a\u5b66\u4e60\u8fc7\u7a0b\u5199\u5f97\u66f4\u771f\u8bda\u4e00\u70b9\u3002'
  },
  {
    date: '03 / 29',
    content: '\u628a\u9875\u9762\u7ec6\u8282\u91cd\u65b0\u770b\u4e86\u4e00\u904d\uff0c\u60f3\u8ba9\u6bcf\u4e2a\u533a\u5757\u90fd\u66f4\u5b89\u9759\u4e00\u70b9\uff0c\u4e5f\u66f4\u50cf\u73b0\u5728\u771f\u6b63\u7684\u72b6\u6001\u3002'
  },
  {
    date: '03 / 28',
    content: '\u665a\u4e0a\u8bfb\u4e86\u4e00\u4e9b\u82f1\u6587\u6280\u672f\u6587\u7ae0\uff0c\u901f\u5ea6\u8fd8\u662f\u6162\uff0c\u4f46\u6bd4\u4e4b\u524d\u66f4\u613f\u610f\u6c89\u4e0b\u5fc3\u628a\u5b83\u4eec\u770b\u5b8c\u3002'
  },
  {
    date: '03 / 27',
    content: '\u6574\u7406\u4e86\u6700\u8fd1\u7684\u5b66\u4e60\u7b14\u8bb0\uff0c\u4e5f\u5728\u60f3\u600e\u4e48\u628a\u8fd9\u4e9b\u8fc7\u7a0b\u5199\u6210\u4ee5\u540e\u80fd\u56de\u770b\u7684\u8bb0\u5f55\u3002'
  },
  {
    date: '03 / 26',
    content: '\u770b\u4e86\u4e00\u4e9b\u540e\u7aef\u63a5\u53e3\u548c\u6570\u636e\u5904\u7406\u7684\u5185\u5bb9\uff0c\u60f3\u6162\u6162\u628a\u524d\u7aef\u4e4b\u5916\u7684\u80fd\u529b\u4e5f\u8865\u5f97\u66f4\u5b8c\u6574\u3002'
  }
]

const displayLogs = computed(() => logs)
const archiveEntryLabel = '[ \u6240\u6709\u8fc7\u5f80\uff0c\u7686\u4e3a\u5e8f\u7ae0 / VIEW ALL ARCHIVE ]'
</script>

<template>
  <section
    id="now"
    class="section-divider scroll-mt-32"
  >
    <div class="section-now-curation min-h-[600px]">
      <div class="grid min-h-[600px] grid-cols-1 gap-y-12 lg:grid-cols-[minmax(0,0.94fr)_0.5px_minmax(0,1.06fr)] lg:items-start lg:gap-x-10">
        <div class="section-now-future flex flex-col p-7 font-chinese lg:sticky lg:top-32">
          <div class="mb-5">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80">
              {{ '\u672a\u6765' }}
            </p>
          </div>

          <div class="section-now-future-list flex flex-1 flex-col">
            <div
              v-for="entry in futureEntries"
              :key="entry.title"
              class="section-now-future-item flex h-full flex-col justify-center"
            >
              <p class="text-sm font-semibold text-on-background">
                {{ entry.title }}
              </p>
              <p class="mt-1 text-sm leading-6 text-on-background/68">
                {{ entry.content }}
              </p>
            </div>
          </div>
        </div>

        <div aria-hidden="true" class="section-now-divider hidden bg-primary/10 lg:block"></div>

        <div class="section-now-log flex flex-col p-7 font-chinese">
          <div class="mb-5">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent/80">
              {{ '\u65e5\u5fd7' }}
            </p>
          </div>

          <div class="section-now-log-panel flex flex-1 flex-col">
            <div class="section-now-log-stream">
              <div
                v-for="log in displayLogs"
                :key="`${log.date}-${log.content}`"
                class="section-now-log-entry"
              >
                <p class="text-xs uppercase tracking-[0.2em] text-on-background/45">
                  {{ log.date }}
                </p>
                <p class="mt-2 text-sm leading-7 text-on-background/78">
                  {{ log.content }}
                </p>
              </div>
            </div>

            <button type="button" class="section-now-archive-link">
              <span aria-hidden="true" class="section-now-archive-glyph">↘</span>
              <span class="section-now-archive-copy">{{ archiveEntryLabel }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-now-future,
.section-now-log {
  transition: opacity 0.55s cubic-bezier(0.2, 1, 0.2, 1);
}

.section-now-divider {
  width: 0.5px;
  justify-self: center;
  align-self: stretch;
}

.section-now-future-item {
  margin-bottom: 1.45rem;
}

.section-now-future-item:last-child,
.section-now-log-entry:last-child {
  margin-bottom: 0;
}

.section-now-future-item > p:first-child {
  font-family: 'LXGW WenKai', serif;
}

.section-now-future-item > p:last-child {
  opacity: 0.6;
}

.section-now-log-entry {
  margin-bottom: 1.7rem;
}

.section-now-log-entry > p:first-child {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  letter-spacing: 0.28em;
}

.section-now-log-entry > p:last-child {
  text-align: justify;
  text-justify: inter-ideograph;
}

.section-now-log-stream {
  height: 500px;
  overflow-y: auto;
  padding-bottom: 0.8rem;
  mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 100px), transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 100px), transparent 100%);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.section-now-log-stream::-webkit-scrollbar {
  display: none;
}

.section-now-archive-link {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
  margin-top: 1rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgb(47 58 74 / 0.72);
  text-align: left;
  transition:
    transform 0.35s cubic-bezier(0.2, 1, 0.2, 1),
    opacity 0.35s cubic-bezier(0.2, 1, 0.2, 1);
}

.section-now-archive-link:hover {
  transform: translate3d(4px, -2px, 0);
  opacity: 1;
}

.section-now-archive-glyph {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1;
  color: rgb(47 58 74 / 0.48);
}

.section-now-archive-copy {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.76rem;
  letter-spacing: 0.16em;
  line-height: 1.8;
}

.section-now-curation:has(.section-now-future:hover) .section-now-log {
  opacity: 0.2;
}

@media (min-width: 1024px) {
  .section-now-future {
    transform: translateY(-30px);
  }

  .section-now-log {
    transform: translateY(30px);
  }
}
</style>
