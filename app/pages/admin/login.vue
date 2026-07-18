<script setup lang="ts">
import AdminStarCanvas from "~/components/transition/AdminStarCanvas.vue";

definePageMeta({
  layout: false,
});

const username = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const canSubmit = computed(() => {
  return username.value.trim() !== "" && password.value.trim() !== "";
});

const handleLogin = async () => {
  if (!canSubmit.value) {
    errorMessage.value = "请输入账号和密码";
    return;
  }

  errorMessage.value = "";
  isLoading.value = true;

  try {
    await $fetch("/api/admin/auth/login", {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
      },
    });

    await navigateTo("/admin");
  } catch {
    errorMessage.value = "账号或密码错误";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050608] px-6 text-[#f5f1e6]"
  >
    <div class="pointer-events-none absolute inset-0 z-0">
      <AdminStarCanvas />
    </div>

    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-[#050608]/55"
    ></div>

    <section class="relative z-10 w-full max-w-[360px]">
      <form class="flex flex-col items-center" @submit.prevent="handleLogin">
        <h1
          class="mb-10 text-center text-5xl font-semibold tracking-[-0.08em] text-[#f5f1e6]"
        >
          AIpenglow
        </h1>

        <div class="w-full space-y-4">
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="Username"
            class="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm text-[#f5f1e6] outline-none backdrop-blur-md transition placeholder:text-white/35 focus:border-white/30 focus:bg-white/[0.09]"
          />

          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Password"
            class="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm text-[#f5f1e6] outline-none backdrop-blur-md transition placeholder:text-white/35 focus:border-white/30 focus:bg-white/[0.09]"
          />
        </div>

        <p v-if="errorMessage" class="mt-4 text-sm text-red-300">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="!canSubmit || isLoading"
          class="mt-6 h-[52px] w-full rounded-2xl bg-[#f5f1e6] text-sm font-medium tracking-[0.18em] text-[#050608] transition hover:-translate-y-0.5 hover:bg-white disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span v-if="!isLoading">LOGIN</span>
          <span v-else>LOADING...</span>
        </button>
      </form>
    </section>
  </main>
</template>
