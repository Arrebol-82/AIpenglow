<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

interface InspirationContent {
  music: {
    favoriteSong: string;
  };
  book: {
    currentBook: string;
    insight: string;
    progress: number;
    readingTime: string;
    favoriteBook: string;
    favoriteBookQuote1: string;
    favoriteBookQuote2: string;
  };
  film: {
    currentFilm: string;
    filmQuote: string;
    favoriteFilm: string;
    favoriteFilmQuote1: string;
    favoriteFilmQuote2: string;
  };
}

interface InspirationResponse {
  id: string;
  sectionKey: string;
  title: string | null;
  content: InspirationContent;
  isPublished: boolean;
  updatedAt: string;
}

const isLoading = ref(true);
const isSaving = ref(false);
const errorMessage = ref("");
const savedMessage = ref("");
const updatedAt = ref("");

const musicForm = reactive({
  favoriteSong: "Already Gone",
});

const bookForm = reactive({
  currentBook: "穷查理宝典",
  insight:
    "“反向思考，总是反向思考。” 一个解决问题的基本思维模型：专注于避免愚蠢而不是寻求辉煌。",
  progress: 45,
  readingTime: "阅读时间：10月 24日",
  favoriteBook: "杀死一只知更鸟",
  favoriteBookQuote1: "有一种东西不能遵循从众原则，那就是人的良心。",
  favoriteBookQuote2: "",
});

const filmForm = reactive({
  currentFilm: "魔女宅急便",
  filmQuote: "内心 - 停一停",
  favoriteFilm: "幽灵公主",
  favoriteFilmQuote1: "活下去/生きろ，你很美",
  favoriteFilmQuote2: "用澄澈无暇的眼睛看清事实",
});

const getTodayReadingTime = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return `阅读时间：${month}月 ${day}日`;
};

const updateReadingTimeToToday = () => {
  bookForm.readingTime = getTodayReadingTime();
};

const getFetchErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const errorData = (
      error as { data?: { message?: string; statusMessage?: string } }
    ).data;

    return (
      errorData?.message ||
      errorData?.statusMessage ||
      "请求失败，请检查 Supabase 配置或接口。"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "请求失败，请检查 Supabase 配置或接口。";
};

const buildContentPayload = (): InspirationContent => {
  return {
    music: {
      favoriteSong: musicForm.favoriteSong,
    },
    book: {
      currentBook: bookForm.currentBook,
      insight: bookForm.insight,
      progress: bookForm.progress,
      readingTime: bookForm.readingTime,
      favoriteBook: bookForm.favoriteBook,
      favoriteBookQuote1: bookForm.favoriteBookQuote1,
      favoriteBookQuote2: bookForm.favoriteBookQuote2,
    },
    film: {
      currentFilm: filmForm.currentFilm,
      filmQuote: filmForm.filmQuote,
      favoriteFilm: filmForm.favoriteFilm,
      favoriteFilmQuote1: filmForm.favoriteFilmQuote1,
      favoriteFilmQuote2: filmForm.favoriteFilmQuote2,
    },
  };
};

const applyContent = (content: InspirationContent) => {
  musicForm.favoriteSong = content.music.favoriteSong;

  bookForm.currentBook = content.book.currentBook;
  bookForm.insight = content.book.insight;
  bookForm.progress = content.book.progress;
  bookForm.readingTime = content.book.readingTime;
  bookForm.favoriteBook = content.book.favoriteBook;
  bookForm.favoriteBookQuote1 = content.book.favoriteBookQuote1;
  bookForm.favoriteBookQuote2 = content.book.favoriteBookQuote2;

  filmForm.currentFilm = content.film.currentFilm;
  filmForm.filmQuote = content.film.filmQuote;
  filmForm.favoriteFilm = content.film.favoriteFilm;
  filmForm.favoriteFilmQuote1 = content.film.favoriteFilmQuote1;
  filmForm.favoriteFilmQuote2 = content.film.favoriteFilmQuote2;
};

const fetchInspiration = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<InspirationResponse>(
      "/api/admin/inspiration",
    );

    applyContent(response.content);
    updatedAt.value = response.updatedAt;
  } catch (error) {
    errorMessage.value = getFetchErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  errorMessage.value = "";
  savedMessage.value = "";

  try {
    const response = await $fetch<InspirationResponse>(
      "/api/admin/inspiration",
      {
        method: "POST",
        body: {
          content: buildContentPayload(),
        },
      },
    );

    applyContent(response.content);
    updatedAt.value = response.updatedAt;
    savedMessage.value = "已保存到 Supabase";

    setTimeout(() => {
      savedMessage.value = "";
    }, 1800);
  } catch (error) {
    errorMessage.value = getFetchErrorMessage(error);
  } finally {
    isSaving.value = false;
  }
};

const handleReset = () => {
  musicForm.favoriteSong = "Already Gone";

  bookForm.currentBook = "穷查理宝典";
  bookForm.insight =
    "“反向思考，总是反向思考。” 一个解决问题的基本思维模型：专注于避免愚蠢而不是寻求辉煌。";
  bookForm.progress = 45;
  bookForm.readingTime = "阅读时间：10月 24日";
  bookForm.favoriteBook = "杀死一只知更鸟";
  bookForm.favoriteBookQuote1 = "有一种东西不能遵循从众原则，那就是人的良心。";
  bookForm.favoriteBookQuote2 = "";

  filmForm.currentFilm = "魔女宅急便";
  filmForm.filmQuote = "内心 - 停一停";
  filmForm.favoriteFilm = "幽灵公主";
  filmForm.favoriteFilmQuote1 = "活下去/生きろ，你很美";
  filmForm.favoriteFilmQuote2 = "用澄澈无暇的眼睛看清事实";
};

onMounted(() => {
  fetchInspiration();
});
</script>

<template>
  <div class="space-y-6">
    <section
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1
          class="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#f5f1e6]"
        >
          唱片管理
        </h1>

        <p class="mt-3 max-w-xl text-sm leading-7 text-white/45">
          管理前台 Inspiration 页面里的音乐、书籍和电影内容。
        </p>

        <p v-if="updatedAt" class="mt-2 text-xs text-white/30">
          Last saved: {{ new Date(updatedAt).toLocaleString() }}
        </p>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          class="h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm text-white/55 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isLoading || isSaving"
          @click="handleReset"
        >
          重置
        </button>

        <button
          type="button"
          class="h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm text-white/55 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isLoading || isSaving"
          @click="fetchInspiration"
        >
          重新读取
        </button>

        <button
          type="button"
          class="h-11 rounded-2xl bg-[#f5f1e6] px-5 text-sm font-medium text-[#050608] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isLoading || isSaving"
          @click="handleSave"
        >
          {{ isSaving ? "保存中..." : "保存修改" }}
        </button>
      </div>
    </section>

    <p
      v-if="isLoading"
      class="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/55"
    >
      正在从 Supabase 读取 Inspiration 数据...
    </p>

    <p
      v-if="errorMessage"
      class="rounded-2xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100"
    >
      {{ errorMessage }}
    </p>

    <p
      v-if="savedMessage"
      class="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100"
    >
      {{ savedMessage }}
    </p>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="space-y-6">
        <div
          class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
        >
          <div class="mb-6 flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-white/70"
            >
              <Icon name="mdi:album" class="h-6 w-6" />
            </div>

            <div>
              <p class="text-xs tracking-[0.2em] text-white/30">MUSIC</p>
              <h2 class="mt-1 text-xl font-semibold text-[#f5f1e6]">
                音乐模块
              </h2>
            </div>
          </div>

          <label class="block">
            <span class="mb-2 block text-sm text-white/45">最爱的歌曲</span>

            <input
              v-model="musicForm.favoriteSong"
              type="text"
              placeholder="请输入最爱的歌曲"
              class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
            />
          </label>
        </div>

        <div
          class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
        >
          <div class="mb-6 flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-white/70"
            >
              <Icon name="mdi:book-open-page-variant-outline" class="h-6 w-6" />
            </div>

            <div>
              <p class="text-xs tracking-[0.2em] text-white/30">BOOK</p>
              <h2 class="mt-1 text-xl font-semibold text-[#f5f1e6]">
                书籍模块
              </h2>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-sm text-white/45">当前书名</span>

              <input
                v-model="bookForm.currentBook"
                type="text"
                placeholder="请输入当前阅读书名"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <div class="block">
              <span class="mb-2 block text-sm text-white/45">阅读时间</span>

              <div class="flex gap-3">
                <div
                  class="flex h-[50px] flex-1 items-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6]/80"
                >
                  {{ bookForm.readingTime }}
                </div>

                <button
                  type="button"
                  class="h-[50px] shrink-0 rounded-2xl bg-[#f5f1e6] px-4 text-sm font-medium text-[#050608] transition hover:bg-white"
                  @click="updateReadingTimeToToday"
                >
                  更新今天
                </button>
              </div>
            </div>

            <label class="block md:col-span-2">
              <span class="mb-2 block text-sm text-white/45">核心洞察</span>

              <textarea
                v-model="bookForm.insight"
                rows="4"
                placeholder="请输入这本书给你的核心洞察"
                class="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm leading-7 text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              ></textarea>
            </label>

            <label class="block md:col-span-2">
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm text-white/45">阅读进度</span>
                <span class="text-sm text-white/60"
                  >{{ bookForm.progress }}%</span
                >
              </div>

              <input
                v-model.number="bookForm.progress"
                type="range"
                min="0"
                max="100"
                class="w-full accent-[#f5f1e6]"
              />
            </label>

            <div class="my-2 h-px bg-white/10 md:col-span-2"></div>

            <label class="block">
              <span class="mb-2 block text-sm text-white/45">最爱书本</span>

              <input
                v-model="bookForm.favoriteBook"
                type="text"
                placeholder="请输入最爱的书名"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-sm text-white/45">书本语录 1</span>

              <input
                v-model="bookForm.favoriteBookQuote1"
                type="text"
                placeholder="请输入第一句书本语录"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <label class="block md:col-span-2">
              <span class="mb-2 block text-sm text-white/45">
                书本语录 2
                <span class="text-white/25">（可选）</span>
              </span>

              <input
                v-model="bookForm.favoriteBookQuote2"
                type="text"
                placeholder="可以留空，也可以输入第二句书本语录"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>
          </div>
        </div>

        <div
          class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
        >
          <div class="mb-6 flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-white/70"
            >
              <Icon name="mdi:movie-open-outline" class="h-6 w-6" />
            </div>

            <div>
              <p class="text-xs tracking-[0.2em] text-white/30">FILM</p>
              <h2 class="mt-1 text-xl font-semibold text-[#f5f1e6]">
                电影模块
              </h2>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-sm text-white/45">电影名</span>

              <input
                v-model="filmForm.currentFilm"
                type="text"
                placeholder="请输入电影名"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-sm text-white/45">电影语录</span>

              <input
                v-model="filmForm.filmQuote"
                type="text"
                placeholder="请输入电影语录"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <div class="my-2 h-px bg-white/10 md:col-span-2"></div>

            <label class="block">
              <span class="mb-2 block text-sm text-white/45">最爱的电影</span>

              <input
                v-model="filmForm.favoriteFilm"
                type="text"
                placeholder="请输入最爱的电影名"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-sm text-white/45"
                >最爱电影语录 1</span
              >

              <input
                v-model="filmForm.favoriteFilmQuote1"
                type="text"
                placeholder="请输入第一句语录"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <label class="block md:col-span-2">
              <span class="mb-2 block text-sm text-white/45">
                最爱电影语录 2
                <span class="text-white/25">（可选）</span>
              </span>

              <input
                v-model="filmForm.favoriteFilmQuote2"
                type="text"
                placeholder="可以留空，也可以输入第二句语录"
                class="h-[50px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>
          </div>
        </div>
      </div>

      <aside class="space-y-5 xl:sticky xl:top-[100px] xl:self-start">
        <div
          class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
        >
          <p class="text-xs tracking-[0.22em] text-white/30">LIVE PREVIEW</p>

          <div class="mt-5 space-y-4">
            <div class="rounded-[1.5rem] bg-[#f5f1e6] p-5 text-[#050608]">
              <p class="text-xs tracking-[0.18em] text-black/35">MUSIC</p>

              <h3 class="mt-3 text-2xl font-semibold tracking-[-0.06em]">
                {{ musicForm.favoriteSong }}
              </h3>

              <p class="mt-2 text-sm text-black/45">最爱的歌曲</p>
            </div>

            <div class="rounded-[1.5rem] bg-white/[0.06] p-5">
              <p class="text-xs tracking-[0.18em] text-white/30">BOOK</p>

              <h3 class="mt-3 text-xl font-semibold text-[#f5f1e6]">
                {{ bookForm.currentBook }}
              </h3>

              <p class="mt-3 text-sm leading-7 text-white/45">
                {{ bookForm.insight }}
              </p>

              <div class="mt-5">
                <div class="mb-2 flex justify-between text-xs text-white/40">
                  <span>{{ bookForm.readingTime }}</span>
                  <span>{{ bookForm.progress }}%</span>
                </div>

                <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    class="h-full rounded-full bg-[#f5f1e6]"
                    :style="{ width: `${bookForm.progress}%` }"
                  ></div>
                </div>
              </div>

              <div class="mt-5 rounded-2xl bg-white/[0.05] p-4">
                <p class="text-xs text-white/30">最爱书本</p>

                <p class="mt-2 text-sm font-medium text-[#f5f1e6]">
                  {{ bookForm.favoriteBook }}
                </p>

                <p class="mt-2 text-sm leading-6 text-white/45">
                  “{{ bookForm.favoriteBookQuote1 }}”
                </p>

                <p
                  v-if="bookForm.favoriteBookQuote2"
                  class="mt-1 text-sm leading-6 text-white/45"
                >
                  “{{ bookForm.favoriteBookQuote2 }}”
                </p>
              </div>
            </div>

            <div class="rounded-[1.5rem] bg-white/[0.06] p-5">
              <p class="text-xs tracking-[0.18em] text-white/30">FILM</p>

              <h3 class="mt-3 text-xl font-semibold text-[#f5f1e6]">
                {{ filmForm.currentFilm }}
              </h3>

              <p class="mt-2 text-sm text-white/45">
                “{{ filmForm.filmQuote }}”
              </p>

              <div class="mt-5 rounded-2xl bg-white/[0.05] p-4">
                <p class="text-xs text-white/30">最爱的电影</p>

                <p class="mt-2 text-sm font-medium text-[#f5f1e6]">
                  {{ filmForm.favoriteFilm }}
                </p>

                <p class="mt-2 text-sm leading-6 text-white/45">
                  “{{ filmForm.favoriteFilmQuote1 }}”
                </p>

                <p
                  v-if="filmForm.favoriteFilmQuote2"
                  class="mt-1 text-sm leading-6 text-white/45"
                >
                  “{{ filmForm.favoriteFilmQuote2 }}”
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>
