<script setup lang="ts">
import {
  projects as fallbackProjects,
  type ArchiveProject,
} from "~/components/site/archive/archiveData";

definePageMeta({
  layout: "admin",
});

type ArchiveContent = {
  projects: ArchiveProject[];
};

type ArchiveApiResponse = {
  id: string | null;
  pageKey: string;
  content: ArchiveContent;
  isPublished: boolean;
  updatedAt: string | null;
};

type UploadResponse = {
  url: string;
  path: string;
};

const isLoading = ref(true);
const isSaving = ref(false);
const isUploading = ref(false);
const errorMessage = ref("");
const savedMessage = ref("");
const uploadMessage = ref("");
const updatedAt = ref<string | null>(null);

const uploadingProjectIndex = ref<number | null>(null);
const isAddModalOpen = ref(false);
const isDraftUploading = ref(false);

const projects = ref<ArchiveProject[]>(
  fallbackProjects.map((item) => ({ ...item })),
);

const draftProject = reactive<ArchiveProject>({
  title: "",
  role: "",
  year: String(new Date().getFullYear()),
  image: "",
  note: "",
});

const projectCount = computed(() => projects.value.length);

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

const normalizeProject = (project: Partial<ArchiveProject>): ArchiveProject => {
  return {
    title: project.title || "未命名作品",
    role: project.role || "作品类型",
    year: project.year || String(new Date().getFullYear()),
    image: project.image || "",
    note: project.note || "作品备注",
  };
};

const applyProjects = (value: ArchiveProject[] | undefined) => {
  const source = value?.length ? value : fallbackProjects;
  projects.value = source.map((item) => normalizeProject(item));
};

const buildContentPayload = (): ArchiveContent => {
  return {
    projects: projects.value.map((item) => ({
      title: item.title,
      role: item.role,
      year: item.year,
      image: item.image,
      note: item.note,
    })),
  };
};

const fetchArchive = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<ArchiveApiResponse>("/api/admin/archive");

    applyProjects(response.content.projects);
    updatedAt.value = response.updatedAt;
  } catch (error) {
    errorMessage.value = getFetchErrorMessage(error);
    applyProjects(fallbackProjects);
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  errorMessage.value = "";
  savedMessage.value = "";

  try {
    const response = await $fetch<ArchiveApiResponse>("/api/admin/archive", {
      method: "POST",
      body: {
        content: buildContentPayload(),
      },
    });

    applyProjects(response.content.projects);
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
  applyProjects(fallbackProjects);
};

const resetDraftProject = () => {
  draftProject.title = "";
  draftProject.role = "";
  draftProject.year = String(new Date().getFullYear());
  draftProject.image = "";
  draftProject.note = "";
};

const openAddModal = () => {
  resetDraftProject();
  uploadMessage.value = "";
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  if (isDraftUploading.value) return;
  isAddModalOpen.value = false;
  resetDraftProject();
};

const confirmAddProject = () => {
  projects.value.unshift(normalizeProject(draftProject));
  closeAddModal();
};

const removeProject = (index: number) => {
  if (projects.value.length <= 1) return;
  projects.value.splice(index, 1);
};

const uploadImageFile = async (file: File) => {
  errorMessage.value = "";
  uploadMessage.value = "";

  if (!file.type.startsWith("image/")) {
    errorMessage.value = "只能上传图片文件。";
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    isUploading.value = true;

    const response = await $fetch<UploadResponse>("/api/admin/upload/image", {
      method: "POST",
      body: formData,
    });

    uploadMessage.value = "图片上传成功";

    setTimeout(() => {
      uploadMessage.value = "";
    }, 1600);

    return response.url;
  } catch (error) {
    errorMessage.value = getFetchErrorMessage(error);
    return null;
  } finally {
    isUploading.value = false;
  }
};

const handleProjectFile = async (file: File, index: number) => {
  uploadingProjectIndex.value = index;

  const url = await uploadImageFile(file);

  if (url) {
    projects.value[index].image = url;
    await handleSave();
  }

  uploadingProjectIndex.value = null;
};

const handleProjectImageChange = async (event: Event, index: number) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  await handleProjectFile(file, index);
  input.value = "";
};

const handleProjectImageDrop = async (event: DragEvent, index: number) => {
  event.preventDefault();

  const file = event.dataTransfer?.files?.[0];

  if (!file) return;

  await handleProjectFile(file, index);
};

const handleDraftFile = async (file: File) => {
  isDraftUploading.value = true;

  const url = await uploadImageFile(file);

  if (url) {
    draftProject.image = url;
  }

  isDraftUploading.value = false;
};

const handleDraftImageChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  await handleDraftFile(file);
  input.value = "";
};

const handleDraftImageDrop = async (event: DragEvent) => {
  event.preventDefault();

  const file = event.dataTransfer?.files?.[0];

  if (!file) return;

  await handleDraftFile(file);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.style.display = "none";
};

onMounted(() => {
  void fetchArchive();
});
</script>

<template>
  <div class="space-y-6">
    <section
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="text-xs font-medium tracking-[0.24em] text-white/35">
          ARCHIVE / WORKS
        </p>

        <h1
          class="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#f5f1e6]"
        >
          Archive 管理
        </h1>

        <p class="mt-3 max-w-xl text-sm leading-7 text-white/45">
          管理前台 Archive 页面里的作品标题、类型、年份、封面图和备注。
        </p>

        <p v-if="updatedAt" class="mt-2 text-xs text-white/30">
          Last saved: {{ new Date(updatedAt).toLocaleString() }}
        </p>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          class="h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm text-white/55 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isLoading || isSaving || isUploading"
          @click="handleReset"
        >
          重置
        </button>

        <button
          type="button"
          class="h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm text-white/55 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isLoading || isSaving || isUploading"
          @click="fetchArchive"
        >
          重新读取
        </button>

        <button
          type="button"
          class="h-11 rounded-2xl bg-[#f5f1e6] px-5 text-sm font-medium text-[#050608] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isLoading || isSaving || isUploading"
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
      正在从 Supabase 读取 Archive 数据...
    </p>

    <p
      v-if="errorMessage"
      class="rounded-2xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100"
    >
      {{ errorMessage }}
    </p>

    <p
      v-if="uploadMessage"
      class="rounded-2xl border border-sky-300/20 bg-sky-300/10 px-4 py-3 text-sm text-sky-100"
    >
      {{ uploadMessage }}
    </p>

    <p
      v-if="savedMessage"
      class="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100"
    >
      {{ savedMessage }}
    </p>

    <section class="grid gap-4 md:grid-cols-3">
      <div
        class="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
      >
        <p class="text-xs tracking-[0.2em] text-white/30">TOTAL</p>
        <p class="mt-4 text-4xl font-semibold tracking-[-0.06em]">
          {{ projectCount }}
        </p>
        <p class="mt-2 text-sm text-white/40">当前作品数量</p>
      </div>

      <div
        class="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl md:col-span-2"
      >
        <p class="text-xs tracking-[0.2em] text-white/30">QUICK ACTION</p>

        <div
          class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-sm leading-6 text-white/45">
            图片可以手动输入 URL，也可以选择本地文件上传到 Supabase Storage。
          </p>

          <button
            type="button"
            class="h-11 shrink-0 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm text-white/60 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isLoading || isSaving || isUploading"
            @click="openAddModal"
          >
            添加作品
          </button>
        </div>
      </div>
    </section>

    <section
      class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
    >
      <div class="mb-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-white/70"
          >
            <Icon name="mdi:briefcase-variant-outline" class="h-6 w-6" />
          </div>

          <div>
            <p class="text-xs tracking-[0.2em] text-white/30">PROJECT LIST</p>
            <h2 class="mt-1 text-xl font-semibold text-[#f5f1e6]">作品列表</h2>
          </div>
        </div>

        <p
          class="rounded-full border border-white/10 px-3 py-1 text-xs text-white/35"
        >
          {{ projectCount }} 个作品
        </p>
      </div>

      <div class="space-y-4">
        <article
          v-for="(item, index) in projects"
          :key="`project-${index}`"
          class="grid gap-4 rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-4 transition hover:bg-white/[0.06] lg:grid-cols-[180px_minmax(0,1fr)_44px]"
        >
          <label
            class="group/image relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-[1.35rem] border border-dashed border-white/15 bg-white/[0.05] transition hover:border-white/30 hover:bg-white/[0.08]"
            @dragover.prevent
            @drop="handleProjectImageDrop($event, index)"
          >
            <input
              type="file"
              accept="image/*"
              class="hidden"
              :disabled="uploadingProjectIndex === index"
              @change="handleProjectImageChange($event, index)"
            />

            <img
              v-if="item.image"
              :key="item.image"
              :src="item.image"
              :alt="item.title"
              class="absolute inset-0 h-full w-full object-cover"
              @error="handleImageError"
            />

            <div
              class="absolute inset-0 bg-black/0 transition group-hover/image:bg-black/35"
            ></div>

            <div
              class="relative z-10 flex flex-col items-center px-4 text-center opacity-0 transition group-hover/image:opacity-100"
              :class="{
                'opacity-100': !item.image || uploadingProjectIndex === index,
              }"
            >
              <Icon
                :name="
                  uploadingProjectIndex === index
                    ? 'mdi:loading'
                    : 'mdi:image-plus-outline'
                "
                class="h-8 w-8 text-white/70"
                :class="{ 'animate-spin': uploadingProjectIndex === index }"
              />

              <p class="mt-3 text-xs leading-5 text-white/65">
                {{
                  uploadingProjectIndex === index
                    ? "上传中..."
                    : "拖拽图片到这里"
                }}
                <br />
                {{ uploadingProjectIndex === index ? "请稍等" : "或点击选择" }}
              </p>
            </div>
          </label>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-sm text-white/45">作品标题</span>

              <input
                v-model="item.title"
                type="text"
                placeholder="请输入作品标题"
                class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-sm text-white/45">类型 / 角色</span>

              <input
                v-model="item.role"
                type="text"
                placeholder="例如：页面设计"
                class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-sm text-white/45">年份</span>

              <input
                v-model="item.year"
                type="text"
                placeholder="例如：2024"
                class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 font-mono text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-sm text-white/45">备注</span>

              <input
                v-model="item.note"
                type="text"
                placeholder="例如：首版草图"
                class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>

            <label class="block md:col-span-2">
              <span class="mb-2 block text-sm text-white/45">图片 URL</span>

              <input
                v-model="item.image"
                type="text"
                placeholder="可以手动输入图片 URL，也可以上传图片后自动填入"
                class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
              />
            </label>
          </div>

          <button
            type="button"
            class="flex aspect-square w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/35 transition hover:border-red-200/20 hover:bg-red-300/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-30 lg:self-start"
            :disabled="
              projects.length <= 1 || isLoading || isSaving || isUploading
            "
            title="删除作品"
            @click="removeProject(index)"
          >
            <Icon name="mdi:trash-can-outline" class="h-5 w-5" />
          </button>
        </article>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="isAddModalOpen"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-5 backdrop-blur-xl"
      >
        <div
          class="w-full max-w-[760px] rounded-[2rem] border border-white/10 bg-[#08090b] p-6 text-[#f5f1e6] shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
        >
          <div class="mb-6 flex items-start justify-between gap-4">
            <div>
              <p class="text-xs tracking-[0.22em] text-white/30">ADD PROJECT</p>

              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                添加作品
              </h2>

              <p class="mt-2 text-sm text-white/40">
                填好作品信息，可以上传封面，也可以手动输入图片 URL。
              </p>
            </div>

            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isDraftUploading"
              @click="closeAddModal"
            >
              <Icon name="mdi:close" class="h-5 w-5" />
            </button>
          </div>

          <div class="grid gap-5 md:grid-cols-[190px_minmax(0,1fr)]">
            <label
              class="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-[1.35rem] border border-dashed border-white/15 bg-white/[0.05] transition hover:border-white/30 hover:bg-white/[0.08]"
              @dragover.prevent
              @drop="handleDraftImageDrop"
            >
              <input
                type="file"
                accept="image/*"
                class="hidden"
                :disabled="isDraftUploading"
                @change="handleDraftImageChange"
              />

              <img
                v-if="draftProject.image"
                :key="draftProject.image"
                :src="draftProject.image"
                :alt="draftProject.title || 'project image'"
                class="absolute inset-0 h-full w-full object-cover"
                @error="handleImageError"
              />

              <div
                class="absolute inset-0 bg-black/0 transition group-hover:bg-black/35"
              ></div>

              <div
                class="relative z-10 flex flex-col items-center px-4 text-center opacity-0 transition group-hover:opacity-100"
                :class="{
                  'opacity-100': !draftProject.image || isDraftUploading,
                }"
              >
                <Icon
                  :name="
                    isDraftUploading ? 'mdi:loading' : 'mdi:image-plus-outline'
                  "
                  class="h-9 w-9 text-white/70"
                  :class="{ 'animate-spin': isDraftUploading }"
                />

                <p class="mt-3 text-xs leading-5 text-white/65">
                  {{ isDraftUploading ? "上传中..." : "拖拽图片到这里" }}
                  <br />
                  {{ isDraftUploading ? "请稍等" : "或点击选择" }}
                </p>
              </div>
            </label>

            <div class="grid gap-4 md:grid-cols-2">
              <label class="block">
                <span class="mb-2 block text-sm text-white/45">作品标题</span>

                <input
                  v-model="draftProject.title"
                  type="text"
                  placeholder="请输入作品标题"
                  class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
                />
              </label>

              <label class="block">
                <span class="mb-2 block text-sm text-white/45"
                  >类型 / 角色</span
                >

                <input
                  v-model="draftProject.role"
                  type="text"
                  placeholder="例如：页面设计"
                  class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
                />
              </label>

              <label class="block">
                <span class="mb-2 block text-sm text-white/45">年份</span>

                <input
                  v-model="draftProject.year"
                  type="text"
                  placeholder="例如：2024"
                  class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 font-mono text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
                />
              </label>

              <label class="block">
                <span class="mb-2 block text-sm text-white/45">备注</span>

                <input
                  v-model="draftProject.note"
                  type="text"
                  placeholder="例如：首版草图"
                  class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
                />
              </label>

              <label class="block md:col-span-2">
                <span class="mb-2 block text-sm text-white/45">图片 URL</span>

                <input
                  v-model="draftProject.image"
                  type="text"
                  placeholder="可以手动输入图片 URL，也可以上传图片后自动填入"
                  class="h-[48px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-[#f5f1e6] outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.08]"
                />
              </label>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm text-white/55 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isDraftUploading"
              @click="closeAddModal"
            >
              取消
            </button>

            <button
              type="button"
              class="h-11 rounded-2xl bg-[#f5f1e6] px-5 text-sm font-medium text-[#050608] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isDraftUploading"
              @click="confirmAddProject"
            >
              确定添加
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
