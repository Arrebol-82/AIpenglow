<template>
  <section
    id="now"
    class="section-divider scroll-mt-32"
  >
    <div class="surface-card h-[734px]">
      <div class="grid h-[670px] grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] items-stretch gap-8">
        <div class="flex h-[670px] flex-col rounded-[1.4rem] border border-primary/25 bg-[#d7edf7] p-7 font-chinese">
          <div class="mb-5">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80">
              未来
            </p>
          </div>

          <div class="grid flex-1 grid-rows-5 gap-3">
            <div class="flex h-full flex-col justify-center rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-sm font-semibold text-on-background">
                把个人网站继续打磨完整
              </p>
              <p class="mt-1 text-sm leading-6 text-on-background/68">
                把页面细节、节奏和内容慢慢收拾到更舒服的状态。
              </p>
            </div>

            <div class="flex h-full flex-col justify-center rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-sm font-semibold text-on-background">
                补上后端基础能力
              </p>
              <p class="mt-1 text-sm leading-6 text-on-background/68">
                把接口、鉴权、部署这些能力一点点补起来。
              </p>
            </div>

            <div class="flex h-full flex-col justify-center rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-sm font-semibold text-on-background">
                提高英文阅读速度
              </p>
              <p class="mt-1 text-sm leading-6 text-on-background/68">
                能更顺手地看文档、看博客，也能少一点停顿。
              </p>
            </div>

            <div class="flex h-full flex-col justify-center rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-sm font-semibold text-on-background">
                做稳定的输出记录
              </p>
              <p class="mt-1 text-sm leading-6 text-on-background/68">
                把学到的东西和每天的进展留下来，不再只停在脑子里。
              </p>
            </div>

            <div class="flex h-full flex-col justify-center rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-sm font-semibold text-on-background">
                保持节奏，不急着证明什么
              </p>
              <p class="mt-1 text-sm leading-6 text-on-background/68">
                先把眼前的事做好，再慢慢把路走宽。
              </p>
            </div>
          </div>
        </div>

        <div class="flex h-[670px] flex-col rounded-[1.4rem] border border-accent/28 bg-[#f1e4d4] p-7 font-chinese">
          <div class="mb-5">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent/80">
              日志
            </p>
          </div>

          <div class="now-log-panel flex-1 space-y-4 overflow-y-auto pr-2">
            <div class="rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.2em] text-on-background/45">
                04 / 02
              </p>
              <p class="mt-2 text-sm leading-7 text-on-background/78">
                在改个人网站的排版，把 Inspiration 和 Now 这两块重新搭得更顺一点。
              </p>
            </div>

            <div class="rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.2em] text-on-background/45">
                04 / 01
              </p>
              <p class="mt-2 text-sm leading-7 text-on-background/78">
                看了一些 Nuxt 和服务端接口的写法，也顺手接了 Last.fm 的最近播放。
              </p>
            </div>

            <div class="rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.2em] text-on-background/45">
                03 / 31
              </p>
              <p class="mt-2 text-sm leading-7 text-on-background/78">
                把最近想做的方向重新整理了一遍，尽量只留下真正会去做的事情。
              </p>
            </div>

            <div class="rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.2em] text-on-background/45">
                03 / 30
              </p>
              <p class="mt-2 text-sm leading-7 text-on-background/78">
                花时间看了点后端知识，也在想怎么把学习过程写得更真诚一点。
              </p>
            </div>

            <div class="rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.2em] text-on-background/45">
                03 / 29
              </p>
              <p class="mt-2 text-sm leading-7 text-on-background/78">
                把页面细节重新看了一遍，想让每个区块都更安静一点，也更像现在真正的状态。
              </p>
            </div>

            <div class="rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.2em] text-on-background/45">
                03 / 28
              </p>
              <p class="mt-2 text-sm leading-7 text-on-background/78">
                晚上读了一些英文技术文章，速度还是慢，但比之前更愿意沉下心把它们看完。
              </p>
            </div>

            <div class="rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.2em] text-on-background/45">
                03 / 27
              </p>
              <p class="mt-2 text-sm leading-7 text-on-background/78">
                整理了最近的学习笔记，也在想怎么把这些过程写成以后能回看的记录。
              </p>
            </div>

            <div class="rounded-[1.1rem] border border-background/55 bg-background/72 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.2em] text-on-background/45">
                03 / 26
              </p>
              <p class="mt-2 text-sm leading-7 text-on-background/78">
                看了一些后端接口和数据处理的内容，想慢慢把前端之外的能力也补得更完整。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
