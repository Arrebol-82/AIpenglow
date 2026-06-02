<script setup lang="ts">
import {
  NOW_WATERMARK,
  NOW_SCALE_VERTICAL_LINE_1,
  NOW_SCALE_VERTICAL_LINE_2,
  NOW_SCALE_QUOTE,
  NOW_BUTTON_ICON,
  NOW_BUTTON_TEXT,
  NOW_FUTURE_ENTRIES,
  NOW_FUTURE_LINE_WIDTHS,
  NOW_LOG_ENTRIES,
} from "~/components/site/now/nowData";

definePageMeta({
  layout: "admin",
});

type GoalEntry = {
  title: string;
  content: string;
};

type DailyLogEntry = {
  date: string;
  content: string;
};

type NowContent = {
  watermark: string;
  scaleVerticalLine1: string;
  scaleVerticalLine2: string;
  scaleQuote: string;
  buttonIcon: string;
  buttonText: string;
  futureLineWidths: number[];
  futureEntries: GoalEntry[];
  logEntries: DailyLogEntry[];
};

type NowApiResponse = {
  id: string;
  pageKey: string;
  content: NowContent;
  isPublished: boolean;
  updatedAt: string;
};

const defaultNowContent: NowContent = {
  watermark: NOW_WATERMARK,
  scaleVerticalLine1: NOW_SCALE_VERTICAL_LINE_1,
  scaleVerticalLine2: NOW_SCALE_VERTICAL_LINE_2,
  scaleQuote: NOW_SCALE_QUOTE,
  buttonIcon: NOW_BUTTON_ICON,
  buttonText: NOW_BUTTON_TEXT,
  futureLineWidths: NOW_FUTURE_LINE_WIDTHS,
  futureEntries: NOW_FUTURE_ENTRIES,
  logEntries: NOW_LOG_ENTRIES,
};

const isLoading = ref(true);
const isSaving = ref(false);
const errorMessage = ref("");
const savedMessage = ref("");
const updatedAt = ref("");

const goals = ref<GoalEntry[]>(
  defaultNowContent.futureEntries.map((item) => ({ ...item })),
);

const dailyLogs = ref<DailyLogEntry[]>(
  defaultNowContent.logEntries.map((item) => ({ ...item })),
);

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

const normalizeContent = (content: Partial<NowContent> | null | undefined) => {
  if (!content || Object.keys(content).length === 0) {
    return defaultNowContent;
  }

  return {
    watermark: content.watermark || defaultNowContent.watermark,
    scaleVerticalLine1:
      content.scaleVerticalLine1 || defaultNowContent.scaleVerticalLine1,
    scaleVerticalLine2:
      content.scaleVerticalLine2 || defaultNowContent.scaleVerticalLine2,
    scaleQuote: content.scaleQuote || defaultNowContent.scaleQuote,
    buttonIcon: content.buttonIcon || defaultNowContent.buttonIcon,
    buttonText: content.buttonText || defaultNowContent.buttonText,
    futureLineWidths: content.futureLineWidths?.length
      ? content.futureLineWidths
      : defaultNowContent.futureLineWidths,
    futureEntries: content.futureEntries?.length
      ? content.futureEntries
      : defaultNowContent.futureEntries,
    logEntries: content.logEntries?.length
      ? content.logEntries
      : defaultNowContent.logEntries,
  };
};

const applyContent = (content: Partial<NowContent> | null | undefined) => {
  const normalizedContent = normalizeContent(content);

  goals.value = normalizedContent.futureEntries
    .slice(0, 5)
    .map((item) => ({ ...item }));

  dailyLogs.value = normalizedContent.logEntries.map((item) => ({ ...item }));
};

const buildContentPayload = (): NowContent => {
  return {
    ...defaultNowContent,
    futureEntries: goals.value.map((item) => ({
      title: item.title,
      content: item.content,
    })),
    logEntries: dailyLogs.value.map((item) => ({
      date: item.date,
      content: item.content,
    })),
  };
};

const fetchNowContent = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<NowApiResponse>("/api/admin/now");

    applyContent(response.content);
    updatedAt.value = response.updatedAt;
  } catch (error) {
    errorMessage.value = getFetchErrorMessage(error);
    applyContent(defaultNowContent);
  } finally {
    isLoading.value = false;
  }
};

const getTodayText = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${month} / ${day}`;
};

const addDailyLog = () => {
  dailyLogs.value.unshift({
    date: getTodayText(),
    content: "在这里记录今天做了什么。",
  });
};

const removeDailyLog = (index: number) => {
  if (dailyLogs.value.length <= 1) return;
  dailyLogs.value.splice(index, 1);
};

const handleReset = () => {
  applyContent(defaultNowContent);
};

const handleSave = async () => {
  isSaving.value = true;
  errorMessage.value = "";
  savedMessage.value = "";

  try {
    const response = await $fetch<NowApiResponse>("/api/admin/now", {
      method: "POST",
      body: buildContentPayload(),
    });

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

onMounted(() => {
  void fetchNowContent();
});
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <section
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1
          class="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#f5f1e6]"
        >
          日志管理
        </h1>

        <p class="mt-3 max-w-xl text-sm leading-7 text-white/45">
          管理前台 Now 页面里的 5 个目标和每日日志内容。
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
          @click="fetchNowContent"
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

    <!-- 状态提示 -->
    <p
      v-if="isLoading"
      class="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/55"
    >
      正在从 Supabase 读取 Now 页面数据...
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

    <!-- 主体 -->
    <section class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <!-- 5 个目标 -->
      <section
        class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
      >
        <div class="mb-6 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-white/70"
            >
              <Icon name="mdi:flag-outline" class="h-6 w-6" />
            </div>

            <div>
              <p class="text-xs tracking-[0.2em] text-white/30">GOALS</p>

              <h2 class="mt-1 text-xl font-semibold text-[#f5f1e6]">
                5 个目标
              </h2>
            </div>
          </div>

          <p
            class="rounded-full border border-white/10 px-3 py-1 text-xs text-white/35"
          >
            固定 5 项
          </p>
        </div>

        <div class="space-y-3">
          <article
            v-for="(item, index) in goals"
            :key="`goal-${index}`"
            class="group rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.065]"
          >
            <div class="mb-3 flex items-center justify-between">
              <p
                class="font-mono text-xs font-bold tracking-[0.18em] text-white/35"
              >
                [IDX-{{ String(index + 1).padStart(2, "0") }}]
              </p>

              <span class="text-xs text-white/20"> GOAL </span>
            </div>

            <div class="space-y-3">
              <input
                v-model="item.title"
                type="text"
                placeholder="目标标题"
                class="h-[46px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />

              <textarea
                v-model="item.content"
                rows="2"
                placeholder="目标内容"
                class="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              ></textarea>
            </div>
          </article>
        </div>
      </section>

      <!-- 每日日志 -->
      <section
        class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
      >
        <div class="mb-6 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-white/70"
            >
              <Icon name="mdi:notebook-edit-outline" class="h-6 w-6" />
            </div>

            <div>
              <p class="text-xs tracking-[0.2em] text-white/30">DAILY LOGS</p>

              <h2 class="mt-1 text-xl font-semibold text-[#f5f1e6]">
                每日日志
              </h2>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <p
              class="rounded-full border border-white/10 px-3 py-1 text-xs text-white/35"
            >
              {{ dailyLogs.length }} 条
            </p>

            <button
              type="button"
              class="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs text-white/55 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isLoading || isSaving"
              @click="addDailyLog"
            >
              添加日志
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <article
            v-for="(item, index) in dailyLogs"
            :key="`daily-log-${index}`"
            class="group grid items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition hover:bg-white/[0.06] md:grid-cols-[120px_minmax(0,1fr)_44px]"
          >
            <input
              v-model="item.date"
              type="text"
              placeholder="04 / 02"
              class="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 font-mono text-xs font-bold tracking-[0.12em] text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
            />

            <textarea
              v-model="item.content"
              rows="2"
              placeholder="请输入当天记录"
              class="min-h-[72px] resize-y rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
            ></textarea>

            <button
              type="button"
              class="flex aspect-square w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/35 transition hover:border-red-200/20 hover:bg-red-300/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="dailyLogs.length <= 1 || isLoading || isSaving"
              title="删除日志"
              @click="removeDailyLog(index)"
            >
              <Icon name="mdi:trash-can-outline" class="h-5 w-5" />
            </button>
          </article>
        </div>
      </section>
    </section>
  </div>
</template>
