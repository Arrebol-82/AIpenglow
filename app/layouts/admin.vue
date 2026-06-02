<script setup lang="ts">
const route = useRoute();

const navItems = [
  {
    label: "唱片管理",
    path: "/admin/inspiration",
    icon: "mdi:album",
  },
  {
    label: "日志管理",
    path: "/admin/now",
    icon: "mdi:notebook-edit-outline",
  },
  {
    label: "作品集",
    path: "/admin/archive",
    icon: "mdi:briefcase-variant-outline",
  },
];

const isActive = (path: string) => {
  if (path === "/admin") {
    return route.path === "/admin";
  }

  return route.path.startsWith(path);
};

const handleLogout = async () => {
  await navigateTo("/admin/login");
};
</script>

<template>
  <main class="relative h-screen overflow-hidden bg-[#050608] text-[#f5f1e6]">
    <!-- 星空背景 -->
    <div class="pointer-events-none absolute inset-0 z-0">
      <AdminStarCanvas />
    </div>

    <!-- 暗色遮罩 -->
    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_70%_20%,rgba(245,241,230,0.08),transparent_35%),linear-gradient(135deg,rgba(5,6,8,0.82),rgba(5,6,8,0.96))]"
    ></div>

    <!-- 后台主体 -->
    <div class="relative z-10 flex h-screen overflow-hidden">
      <!-- 左侧导航栏：固定视口高度，不被右侧页面撑高 -->
      <aside
        class="relative hidden h-screen w-[220px] shrink-0 overflow-hidden border-r border-white/10 bg-white/[0.04] px-4 py-6 backdrop-blur-2xl lg:block"
      >
        <!-- Logo -->
        <NuxtLink to="/admin" class="block">
          <h1 class="text-3xl font-semibold tracking-[-0.08em] text-[#f5f1e6]">
            AIpenglow
          </h1>

          <p class="mt-2 text-xs tracking-[0.24em] text-white/35">
            ADMIN SYSTEM
          </p>
        </NuxtLink>

        <!-- 导航 -->
        <nav class="mt-10 space-y-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="group block rounded-2xl border px-4 py-3.5 transition duration-300"
            :class="
              isActive(item.path)
                ? 'border-white/20 bg-[#f5f1e6] text-[#050608]'
                : 'border-transparent bg-transparent text-white/55 hover:border-white/10 hover:bg-white/[0.06] hover:text-[#f5f1e6]'
            "
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon
                  :name="item.icon"
                  class="h-5 w-5 shrink-0"
                  :class="
                    isActive(item.path)
                      ? 'text-[#050608]'
                      : 'text-white/45 group-hover:text-[#f5f1e6]'
                  "
                />

                <span class="text-sm font-medium tracking-[0.08em]">
                  {{ item.label }}
                </span>
              </div>

              <Icon
                name="mdi:chevron-right"
                class="h-4 w-4 transition"
                :class="
                  isActive(item.path)
                    ? 'text-[#050608]/45'
                    : 'text-white/25 group-hover:text-white/50'
                "
              />
            </div>
          </NuxtLink>
        </nav>

        <!-- 底部入口 -->
        <div
          class="absolute bottom-6 left-4 right-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4"
        >
          <p class="text-xs tracking-[0.22em] text-white/30">FRONT SITE</p>

          <NuxtLink
            to="/"
            class="mt-3 flex items-center justify-between rounded-xl bg-[#f5f1e6] px-4 py-3 text-sm font-medium text-[#050608] transition hover:bg-white"
          >
            <span>View Website</span>
            <Icon name="mdi:arrow-right" class="h-4 w-4" />
          </NuxtLink>
        </div>
      </aside>

      <!-- 右侧区域：固定一屏，内部内容滚动 -->
      <section class="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <!-- 顶部栏 -->
        <header
          class="shrink-0 border-b border-white/10 bg-[#050608]/55 px-5 py-5 backdrop-blur-2xl lg:px-8"
        >
          <div class="flex items-center justify-between">
            <h2
              class="text-2xl font-semibold tracking-[-0.05em] text-[#f5f1e6]"
            >
              Hello Arrebol 👋
            </h2>

            <button
              type="button"
              class="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-xs tracking-[0.16em] text-white/55 transition hover:bg-white/[0.1] hover:text-white"
              @click="handleLogout"
            >
              LOGOUT
            </button>
          </div>
        </header>

        <!-- 移动端导航 -->
        <div
          class="flex shrink-0 gap-2 overflow-x-auto border-b border-white/10 px-4 py-3 lg:hidden"
        >
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs tracking-[0.08em] transition"
            :class="
              isActive(item.path)
                ? 'border-white/20 bg-[#f5f1e6] text-[#050608]'
                : 'border-white/10 bg-white/[0.04] text-white/50'
            "
          >
            <Icon :name="item.icon" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>

        <!-- 页面内容显示区：只有这里滚动 -->
        <main class="min-h-0 flex-1 overflow-y-auto px-5 py-8 lg:px-8">
          <slot />
        </main>
      </section>
    </div>
  </main>
</template>
